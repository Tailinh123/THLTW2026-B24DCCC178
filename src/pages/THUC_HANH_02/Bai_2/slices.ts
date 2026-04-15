/* ============================================================
 * THUC_HANH_01 — Bài 2: All Slices
 * Redux Toolkit slices for Category, Question, and Exam management
 * ============================================================ */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { genId } from '../common';
import type {
  KhoiKienThuc,
  MonHoc,
  CauHoi,
  CauTrucDeThi,
  DeThi,
  CauHoiFilter,
} from './types';

/* =============================================================
 * SLICE 1: Danh Mục (Khối Kiến Thức + Môn Học)
 * ============================================================= */
interface DanhMucState {
  khoiKienThucs: KhoiKienThuc[];
  monHocs: MonHoc[];
}

const danhMucInitial: DanhMucState = {
  khoiKienThucs: [],
  monHocs: [],
};

export const danhMucSlice = createSlice({
  name: 'danhMuc',
  initialState: danhMucInitial,
  reducers: {
    /* --- Khối Kiến Thức --- */
    addKKT(state, action: PayloadAction<Omit<KhoiKienThuc, 'id'>>) {
      state.khoiKienThucs.push({ id: genId(), ...action.payload });
    },
    updateKKT(state, action: PayloadAction<KhoiKienThuc>) {
      const idx = state.khoiKienThucs.findIndex((k) => k.id === action.payload.id);
      if (idx >= 0) state.khoiKienThucs[idx] = action.payload;
    },
    deleteKKT(state, action: PayloadAction<string>) {
      state.khoiKienThucs = state.khoiKienThucs.filter((k) => k.id !== action.payload);
      state.monHocs.forEach((m) => {
        m.khoiKienThucIds = m.khoiKienThucIds.filter((id) => id !== action.payload);
      });
    },

    /* --- Môn Học --- */
    addMonHoc(state, action: PayloadAction<Omit<MonHoc, 'id'>>) {
      state.monHocs.push({ id: genId(), ...action.payload });
    },
    updateMonHoc(state, action: PayloadAction<MonHoc>) {
      const idx = state.monHocs.findIndex((m) => m.id === action.payload.id);
      if (idx >= 0) state.monHocs[idx] = action.payload;
    },
    deleteMonHoc(state, action: PayloadAction<string>) {
      state.monHocs = state.monHocs.filter((m) => m.id !== action.payload);
    },

    /* --- Hydrate --- */
    hydrateDanhMuc(_state, action: PayloadAction<DanhMucState>) {
      return action.payload;
    },
  },
});

/* =============================================================
 * SLICE 2: Câu Hỏi
 * ============================================================= */
interface CauHoiState {
  items: CauHoi[];
  filter: CauHoiFilter;
}

const cauHoiInitial: CauHoiState = {
  items: [],
  filter: {},
};

export const cauHoiSlice = createSlice({
  name: 'cauHoi',
  initialState: cauHoiInitial,
  reducers: {
    addCauHoi(state, action: PayloadAction<Omit<CauHoi, 'id' | 'createdAt' | 'updatedAt'>>) {
      const now = new Date().toISOString();
      state.items.push({ id: genId(), createdAt: now, updatedAt: now, ...action.payload });
    },
    updateCauHoi(state, action: PayloadAction<CauHoi>) {
      const idx = state.items.findIndex((c) => c.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = { ...action.payload, updatedAt: new Date().toISOString() };
      }
    },
    deleteCauHoi(state, action: PayloadAction<string>) {
      state.items = state.items.filter((c) => c.id !== action.payload);
    },
    deleteCauHoiBatch(state, action: PayloadAction<string[]>) {
      const ids = new Set(action.payload);
      state.items = state.items.filter((c) => !ids.has(c.id));
    },
    setFilter(state, action: PayloadAction<CauHoiFilter>) {
      state.filter = action.payload;
    },
    clearFilter(state) {
      state.filter = {};
    },

    /* --- Hydrate --- */
    hydrateCauHoi(_state, action: PayloadAction<CauHoiState>) {
      return action.payload;
    },
  },
});

/* =============================================================
 * SLICE 3: Đề Thi (Templates + Generated Exams)
 * ============================================================= */
interface DeThiState {
  cauTrucs: CauTrucDeThi[];
  deThis: DeThi[];
}

const deThiInitial: DeThiState = {
  cauTrucs: [],
  deThis: [],
};

export const deThiSlice = createSlice({
  name: 'deThi',
  initialState: deThiInitial,
  reducers: {
    /* --- Cấu trúc (Template) --- */
    addCauTruc(state, action: PayloadAction<Omit<CauTrucDeThi, 'id' | 'createdAt'>>) {
      state.cauTrucs.push({
        id: genId(),
        createdAt: new Date().toISOString(),
        ...action.payload,
      });
    },
    updateCauTruc(state, action: PayloadAction<CauTrucDeThi>) {
      const idx = state.cauTrucs.findIndex((c) => c.id === action.payload.id);
      if (idx >= 0) state.cauTrucs[idx] = action.payload;
    },
    deleteCauTruc(state, action: PayloadAction<string>) {
      state.cauTrucs = state.cauTrucs.filter((c) => c.id !== action.payload);
    },

    /* --- Đề Thi --- */
    addDeThi(state, action: PayloadAction<Omit<DeThi, 'id' | 'createdAt'>>) {
      state.deThis.push({
        id: genId(),
        createdAt: new Date().toISOString(),
        ...action.payload,
      });
    },
    deleteDeThi(state, action: PayloadAction<string>) {
      state.deThis = state.deThis.filter((d) => d.id !== action.payload);
    },

    /* --- Hydrate --- */
    hydrateDeThi(_state, action: PayloadAction<DeThiState>) {
      return action.payload;
    },
  },
});

/* ===== Action Exports ===== */
export const dmActions = danhMucSlice.actions;
export const chActions = cauHoiSlice.actions;
export const dtActions = deThiSlice.actions;
