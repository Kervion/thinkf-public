"use client"

function CustomInput(props: any) {
  return (
    <>
      <div className="mx-2 my-1 justify-start flex text-xs text-slate-800">{props.label}</div>
      <input className="w-80 p-2 rounded-md" type={props.typ} name={props.nazwa} value={props.wartosc} onChange={props.akcja} required />
      <br />
      <br />
    </>
  )
}

export default CustomInput
