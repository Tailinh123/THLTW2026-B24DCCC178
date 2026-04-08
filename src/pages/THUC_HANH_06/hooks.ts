import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from './store';
import { destActions, itinActions, budgetActions } from './slices';
import { api } from './services';
import type {
  Destination,
  FilterOptions,
  BudgetAlert,
  BudgetThreshold,
} from './types';
import { totalCost, haversineKm, genId } from './types';

/* ===== useDestinations ===== */
export function useDestinations(filters?: Partial<FilterOptions>) {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.destinations);

  const filtered = useMemo(() => {
    let result = [...items];
    if (filters) {
      if (filters.types && filters.types.length > 0) {
        result = result.filter((d) => filters.types!.includes(d.type));
      }
      if (filters.minRating && filters.minRating > 0) {
        result = result.filter((d) => d.rating >= filters.minRating!);
      }
      if (filters.priceRange) {
        result = result.filter((d) => {
          const c = totalCost(d);
          return c >= filters.priceRange![0] && c <= filters.priceRange![1];
        });
      }
      const sortBy = filters.sortBy || 'rating';
      const order = filters.sortOrder || 'desc';
      result.sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'rating') cmp = a.rating - b.rating;
        else if (sortBy === 'price') cmp = totalCost(a) - totalCost(b);
        else cmp = a.title.localeCompare(b.title);
        return order === 'desc' ? -cmp : cmp;
      });
    }
    return result;
  }, [items, filters]);

  const loadAll = useCallback(async () => {
    dispatch(destActions.setLoading(true));
    const data = await api.getDestinations();
    dispatch(destActions.setDestinations(data));
  }, [dispatch]);

  const create = useCallback(
    async (dest: Omit<Destination, 'id'>) => {
      const full: Destination = { ...dest, id: genId() };
      dispatch(destActions.addDestination(full));
      const all = [...items, full];
      await api.saveDestinations(all);
      return full;
    },
    [dispatch, items],
  );

  const update = useCallback(
    async (dest: Destination) => {
      dispatch(destActions.updateDestination(dest));
      const all = items.map((d) => (d.id === dest.id ? dest : d));
      await api.saveDestinations(all);
    },
    [dispatch, items],
  );

  const remove = useCallback(
    async (id: string) => {
      dispatch(destActions.deleteDestination(id));
      const all = items.filter((d) => d.id !== id);
      await api.saveDestinations(all);
    },
    [dispatch, items],
  );

  return { destinations: filtered, allDestinations: items, loading, loadAll, create, update, remove };
}

/* ===== useItinerary ===== */
export function useItinerary() {
  const dispatch = useAppDispatch();
  const { current, loading } = useAppSelector((s) => s.itinerary);
  const allDest = useAppSelector((s) => s.destinations.items);

  const load = useCallback(async () => {
    dispatch(itinActions.setItineraryLoading(true));
    const data = await api.getItinerary();
    dispatch(itinActions.setItinerary(data));
  }, [dispatch]);

  const save = useCallback(async () => {
    await api.saveItinerary(current);
  }, [current]);

  const addDay = useCallback(() => {
    dispatch(itinActions.addDay());
  }, [dispatch]);

  const removeDay = useCallback(
    (dayId: string) => {
      dispatch(itinActions.removeDay(dayId));
    },
    [dispatch],
  );

  const addItemToDay = useCallback(
    (dayId: string, destinationId: string) => {
      dispatch(itinActions.addItemToDay({ dayId, destinationId }));
    },
    [dispatch],
  );

  const removeItem = useCallback(
    (dayId: string, itemId: string) => {
      dispatch(itinActions.removeItemFromDay({ dayId, itemId }));
    },
    [dispatch],
  );

  const reorderItems = useCallback(
    (dayId: string, sourceIndex: number, destIndex: number) => {
      const day = current.days.find((d) => d.id === dayId);
      if (!day) return;
      const reordered = [...day.items];
      const [moved] = reordered.splice(sourceIndex, 1);
      reordered.splice(destIndex, 0, moved);
      dispatch(itinActions.reorderItems({ dayId, items: reordered }));
    },
    [dispatch, current],
  );

  const moveItemBetweenDays = useCallback(
    (sourceDayId: string, destDayId: string, sourceIndex: number, destIndex: number) => {
      dispatch(itinActions.moveItemBetweenDays({ sourceDayId, destDayId, sourceIndex, destIndex }));
    },
    [dispatch],
  );

  const renameTrip = useCallback(
    (name: string) => {
      dispatch(itinActions.updateItineraryName(name));
    },
    [dispatch],
  );

  const getDestById = useCallback(
    (id: string) => allDest.find((d) => d.id === id),
    [allDest],
  );

  const totalBudget = useMemo(() => {
    let sum = 0;
    current.days.forEach((day) => {
      day.items.forEach((item) => {
        const dest = allDest.find((d) => d.id === item.destinationId);
        if (dest) sum += totalCost(dest);
      });
    });
    return sum;
  }, [current, allDest]);

  const totalDuration = useMemo(() => {
    let hrs = 0;
    current.days.forEach((day) => {
      day.items.forEach((item) => {
        const dest = allDest.find((d) => d.id === item.destinationId);
        if (dest) hrs += dest.visitDuration;
      });
    });
    return hrs;
  }, [current, allDest]);

  const travelTimeByDay = useMemo(() => {
    const result: Record<string, number> = {};
    current.days.forEach((day) => {
      let time = 0;
      for (let i = 1; i < day.items.length; i++) {
        const prev = allDest.find((d) => d.id === day.items[i - 1].destinationId);
        const curr = allDest.find((d) => d.id === day.items[i].destinationId);
        if (prev?.coordinates && curr?.coordinates) {
          const dist = haversineKm(
            prev.coordinates.lat,
            prev.coordinates.lng,
            curr.coordinates.lat,
            curr.coordinates.lng,
          );
          time += (dist * 1.3) / 40;
        } else {
          time += 1.5;
        }
      }
      result[day.id] = Math.round(time * 10) / 10;
    });
    return result;
  }, [current, allDest]);

  const spendByCategory = useMemo(() => {
    const cat = { food: 0, stay: 0, transport: 0 };
    current.days.forEach((day) => {
      day.items.forEach((item) => {
        const dest = allDest.find((d) => d.id === item.destinationId);
        if (dest) {
          cat.food += dest.costBreakdown.food;
          cat.stay += dest.costBreakdown.stay;
          cat.transport += dest.costBreakdown.transport;
        }
      });
    });
    return cat;
  }, [current, allDest]);

  return {
    itinerary: current,
    loading,
    load,
    save,
    addDay,
    removeDay,
    addItemToDay,
    removeItem,
    reorderItems,
    moveItemBetweenDays,
    renameTrip,
    getDestById,
    totalBudget,
    totalDuration,
    travelTimeByDay,
    spendByCategory,
  };
}

/* ===== useBudget ===== */
export function useBudget() {
  const dispatch = useAppDispatch();
  const threshold = useAppSelector((s) => s.budget.threshold);
  const { spendByCategory, totalBudget } = useItinerary();

  const load = useCallback(async () => {
    const data = await api.getBudget();
    dispatch(budgetActions.setThreshold(data));
  }, [dispatch]);

  const saveBudget = useCallback(
    async (t: BudgetThreshold) => {
      dispatch(budgetActions.setThreshold(t));
      await api.saveBudget(t);
    },
    [dispatch],
  );

  const alerts = useMemo((): BudgetAlert[] => {
    const result: BudgetAlert[] = [];
    const check = (cat: BudgetAlert['category'], spent: number, limit: number | undefined) => {
      if (!limit || limit <= 0) return;
      const pct = (spent / limit) * 100;
      if (pct >= 100) result.push({ category: cat, level: 'exceeded', percent: pct, spent, limit });
      else if (pct >= 80) result.push({ category: cat, level: 'warning', percent: pct, spent, limit });
    };
    check('total', totalBudget, threshold.total);
    check('food', spendByCategory.food, threshold.food);
    check('stay', spendByCategory.stay, threshold.stay);
    check('transport', spendByCategory.transport, threshold.transport);
    return result;
  }, [threshold, spendByCategory, totalBudget]);

  return { threshold, alerts, spendByCategory, totalSpend: totalBudget, load, saveBudget };
}
