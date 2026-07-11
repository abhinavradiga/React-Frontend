import { useAppSelector, useAppDispatch } from '../store/hooks'
import { increment, decrement, reset } from '../store/slices/counterSlice'

export default function CounterView() {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <div data-testid="counter-view">
      <h3>Counter</h3>
      <p data-testid="counter-value">{count}</p>
      <button data-testid="increment-btn" onClick={() => dispatch(increment())}>+</button>
      <button data-testid="decrement-btn" onClick={() => dispatch(decrement())}>-</button>
      <button data-testid="reset-btn" onClick={() => dispatch(reset())}>Reset</button>
    </div>
  )
}