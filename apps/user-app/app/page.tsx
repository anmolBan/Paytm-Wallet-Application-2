"use client"

import { balanceAtom } from "@repo/store/atoms";
import { useRecoilState } from "recoil";

export default function Home() {
  const [ balance, setBalance ] = useRecoilState(balanceAtom);
  return (
    <div>
      Balance {balance}
      <button onClick={() => {
        setBalance(balance + 1)
      }}>+</button>
      <button onClick={() => {
        setBalance(balance - 1)
      }}>-</button>
    </div>
  );
}
