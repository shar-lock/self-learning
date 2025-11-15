import { useCallback, useState } from "react";

export function useInput(init:any){
  let [value,setValue] = useState(init)
  let onChange = useCallback( function (e:React.ChangeEvent<HTMLInputElement>){
    setValue(e.target.value)
  },[])
  return {
    value,
    onChange,
  }
}