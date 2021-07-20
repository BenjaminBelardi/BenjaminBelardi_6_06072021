import { fireEvent, screen } from "@testing-library/dom"
//import {render } from "@testing-library/react"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES } from '../constants/routes.js'
import firebase from "../__mocks__/firebase"
import { EXPECTED_COLOR } from "jest-matcher-utils"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("all form data is populate before new bill send", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const inputData = {
        email: "johndoe@email.com",
        expenseType : "Transports",
        expenseName : "Billed Presentation",
        datepicker : "2021-07-16",
        expenseAmount : "100",
        expenseTVA : "70",
        expensePCT : "20",
        expenseCommentary : "hotel",
        expenseFile : "hotel.jpg"
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: inputData.email
      }))

      // we have to mock navigation to test it
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const inputExpenseType = screen.getByTestId("expense-type")
      fireEvent.click(inputExpenseType, { target: { value: inputData.expenseType , name : inputData.expenseType , selectedIndex : 0}})
      expect(inputExpenseType.value).toBe(inputData.expenseType)

      const inputExpenseName = screen.getByTestId("expense-name")
      fireEvent.change(inputExpenseName, { target: { value: inputData.expenseName } })
      expect(inputExpenseName.value).toBe(inputData.expenseName)

      const inputExpenseDate = screen.getByTestId("datepicker")
      fireEvent.change(inputExpenseDate, { target: { value: inputData.datepicker } })
      expect(inputExpenseDate.value).toBe(inputData.datepicker)

      const inputExpenseAmount = screen.getByTestId("amount")
      fireEvent.change(inputExpenseAmount, { target: { value: inputData.expenseAmount } })
      expect(inputExpenseAmount.value).toBe(inputData.expenseAmount)

      const inputExpenseTva = screen.getByTestId("vat")
      fireEvent.change(inputExpenseTva, { target: { value: inputData.expenseTVA } })
      expect(inputExpenseTva.value).toBe(inputData.expenseTVA)

      const inputExpensePct = screen.getByTestId("pct")
      fireEvent.change(inputExpensePct, { target: { value: inputData.expensePCT } })
      expect(inputExpensePct.value).toBe(inputData.expensePCT)

      const inputExpenseCom = screen.getByTestId("commentary")
      fireEvent.change(inputExpenseCom, { target: { value: inputData.expenseCommentary } })
      expect(inputExpenseCom.value).toBe(inputData.expenseCommentary)

      const firestore = null

      const newBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage
      })

      const form = screen.getByTestId("form-new-bill")
      const handleSubmit = jest.fn(e=>newBill.handleSubmit(e))
    
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalledTimes(1)
      expect(screen.getAllByText('Mes notes de frais')).toBeTruthy()
    })
    
    describe("When I load a proof file with good extention", () => {
      test("the submit button is available", () => {
        const html = NewBillUI()
        document.body.innerHTML = html

        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))

        // we have to mock navigation to test it
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const firestore = null

        const newBill = new NewBill({
          document,
          onNavigate,
          firestore,
          localStorage: window.localStorage
        })

        const inputFile = new File(["chucknorris"], 'chucknorris.jpeg', { type: 'image/jpeg', })
        const filetest = screen.getByTestId("file")
        const btn = document.getElementById("btn-send-bill")
        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))

        filetest.addEventListener("change", handleChangeFile)
        fireEvent.change(filetest, {
          target: {
            files: [inputFile]
          }
        })
        expect(handleChangeFile).toHaveBeenCalled()
        expect(btn.disabled).not.toBeTruthy()
      })
    })
  })

  describe("When I load a proof file with bad extention", () => {
    test("the submit button is disabled", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      const newBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage
      })

      const inputFile = new File(["chucknorris"], 'chucknorris.txt', { type: 'image/txt', })
      const filetest = screen.getByTestId("file")
      const btn = document.getElementById("btn-send-bill")
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))

      filetest.addEventListener("change", handleChangeFile)
      fireEvent.change(filetest, {
        target: {
          files: [inputFile]
        }
      })
      expect(handleChangeFile).toHaveBeenCalled()
      expect(btn.disabled).toBeTruthy()
    })
  })
// test d'integration POST
  describe("When I Send a New bill", () => {
    test("fetches new bills from mock API POST", async () => {
     const formData = {
          email: "johndoe@email.com",
          expenseType : "Transport",
          expenseName : "Billed Presentation",
          datepicker : "2021-07-16",
          expenseAmount : "100",
          expenseTVA : "70",
          expensePCT : "20",
          expenseCommentary : "hotel",
          expenseFile : "hotel.jpg"
      }
       const postSpy = jest.spyOn(firebase, "post")
       const newBill = await firebase.post(formData)
       expect(newBill).toMatch(JSON.stringify(formData))
       expect(postSpy).toHaveBeenCalledTimes(1)
       expect(postSpy).toHaveBeenCalledWith(
         formData
       )
    })
  })
})
