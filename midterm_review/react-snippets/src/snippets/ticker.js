import { useState } from "react";
export default function App() {
    const [count, setCount] = useState(0);
    const handleIncrement = () => {
        setCount(count + 1);
    };
    const handleDecreament = () => {
        setCount(count - 1);
    };
    return (
        <div>
            <p>{count}</p>
            <button onClick={handleIncrement}>Increment</button>
            <button onClick={handleDecreament}>Decrement</button>
        </div>
    );
}
