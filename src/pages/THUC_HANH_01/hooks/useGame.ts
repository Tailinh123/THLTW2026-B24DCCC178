import { useDispatch, useSelector } from 'react-redux';
import { startGame, makeGuess, resetGame } from '../redux/slices/gameSlice';
import { RootState, AppDispatch } from '../redux/store';

export const useGame = () => {
  const dispatch = useDispatch<AppDispatch>();
  const game = useSelector((state: RootState) => state.game);
  
  return {
    ...game,
    start: () => dispatch(startGame()),
    guess: (v: number) => dispatch(makeGuess(v)),
    reset: () => dispatch(resetGame()),
  };
};
