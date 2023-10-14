"use client"

import { useState, useCallback, useEffect } from "react"
import axios from "axios"
import Slider from "@mui/material/Slider"
import { useDropzone } from "react-dropzone"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "./custom.css"
import CustomInput from "./components/CustomInput"

const POST_API = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" // FALSE API
const GET_API = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxgit"
const API_KEY = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

type FormData = {
  firstName: string
  lastName: string
  email: string
  age: number
  photo: File | null
  date: Date
}

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    age: 18,
    photo: null,
    date: new Date(),
  })

  const [photoInfo, setPhotoInfo] = useState("Upload a photo or drag 'n' drop here.")
  const [excluded, setExcluded] = useState<Date[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(GET_API, {
        headers: { "X-Api-Key": API_KEY },
      })
      const dates: Date[] = []
      result.data.forEach((item: { type: string; date: string }) => {
        if (item.type === "NATIONAL_HOLIDAY" || item.type === "OBSERVANCE") {
          const date = new Date(item.date)
          dates.push(date)
        }
      })
      setExcluded(dates)
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("DATA TO SEND : ", formData)
    const formDatax = new FormData()
    formDatax.append("firstName", formData.firstName)
    formDatax.append("lastName", formData.lastName)
    formDatax.append("email", formData.email)
    formDatax.append("age", formData.age.toString())
    if (formData.photo) {
      formDatax.append("photo", formData.photo)
    }
    formDatax.append("date", formData.date.toString())

    // ENABLE IN PRODUCTION
    // try {
    //   const response = await axios.post(POST_API, formDatax, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   })
    //   console.log("Response:", response.data)
    // } catch (error) {
    //   console.error("Error posting form data", error)
    // }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      setFormData({ ...formData, photo: acceptedFiles[0] })
      setPhotoInfo(acceptedFiles[0].name)
    },
    [formData]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    // NOT WORKING IN BUILD
    // accept: {
    //   "image/*": [".png", ".gif", ".jpeg", ".jpg"],
    // },
  })

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setFormData({ ...formData, age: newValue as number })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
        <h3 className="text-xl font-semibold text-slate-800">Personal Info</h3>

        {CustomInput({ label: "First name", nazwa: "firstName", wartosc: formData.firstName, akcja: handleInputChange, typ: "text" })}
        {CustomInput({ label: "Last name", nazwa: "lastName", wartosc: formData.lastName, akcja: handleInputChange, typ: "text" })}
        {CustomInput({ label: "Email", nazwa: "email", wartosc: formData.email, akcja: handleInputChange, typ: "email" })}

        <div className="px-3">
          <div className="my-1 justify-start flex text-xs text-slate-800">Age</div>
          <Slider
            size="small"
            min={8}
            step={1}
            value={formData.age}
            max={100}
            aria-label="Small"
            valueLabelDisplay="on"
            onChange={handleSliderChange}
            sx={{
              "& .MuiSlider-valueLabel": {
                top: "auto",
                bottom: "-60px",
                backgroundColor: "#1E293B",
                "&:before": {
                  top: "-8px",
                },
              },
              color: "#1E293B",
              "& .MuiSlider-thumb": {
                backgroundColor: "#fff",
                "&:hover, &.Mui-focusVisible": {
                  boxShadow: "#1E293B",
                },
              },
              "& .MuiSlider-rail": {
                color: "#E2E8F0",
              },
            }}
          />
        </div>
        <br />
        <br />
        <div {...getRootProps()} className="flex justify-center">
          <input {...getInputProps()} />
          <p className="text-sm w-80 bg-slate-200 text-center py-6 rounded-md text-slate-500">{photoInfo}</p>
        </div>
        <br />
        <h3 className="text-xl mb-3 font-semibold text-slate-800">Your Workout</h3>
        <DatePicker
          inline
          excludeDates={excluded}
          selected={formData.date}
          onChange={(date: Date) => setFormData({ ...formData, date })}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={30}
          timeCaption="Time"
          dateFormat="MMMM d, yyyy h:mm aa"
        />
        <br />

        <button type="submit" className="w-80 bg-slate-700 p-2 rounded-md text-white font-semibold">
          Send application
        </button>
      </form>
    </main>
  )
}
