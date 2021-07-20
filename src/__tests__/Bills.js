import { fireEvent, screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import firebase from "../__mocks__/firebase"
import { ROUTES  } from '../constants/routes.js'
import Bills from "../containers/Bills.js"
import { query } from "express"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
      }))
      
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      const billIcon = screen.getByTestId("icon-window")
      expect(billIcon.classList.contains("active-icon")).toBeTruthy

    })
    test("Then bills should be ordered from earliest to latest", () => {
      const antiChronoBills = (a, b) => ((a.date < b.date) ? 1 : -1)
      const html = BillsUI({ data: bills.sort(antiChronoBills)})
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test("Loading Page success load", () => {
      const html = BillsUI( {loading : true })
      document.body.innerHTML = html
      const message = screen.getByText(/Loading.../)
      expect(message).toBeTruthy()
    })
  })
  describe("when i click on newbill button",() =>{
    test ("A new bill page is open",() =>{
      //check hendleClickBill 
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
      }))

      // we have to mock navigation to test it
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const newBills = new Bills ({
        document,
        onNavigate,
        firestore :null,
        localStorage :  window.localStorage
      })

      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      const btnNewBill = screen.getByTestId("btn-new-bill")
      const handleClickNewBill = jest.fn(e => newBills.handleClickNewBill(e))
      btnNewBill.addEventListener("click", handleClickNewBill)
      fireEvent.click(btnNewBill)
      expect(handleClickNewBill).toHaveBeenCalled()
      const formNewBill = screen.getByTestId('form-new-bill') 
      expect(formNewBill).toBeTruthy
    })
  })
})

// test d'intégration GET
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
       const getSpy = jest.spyOn(firebase, "get")
       const bills = await firebase.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })

  describe  ("When I click on icon eye", () => {
    test("The modal should be open",() => {
      // we have to mock navigation to test it
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
      }))

      const html = BillsUI({ data: bills })
      document.body.innerHTML = html

      const newBills = new Bills ({
        document,
        onNavigate,
        firestore :null,
        localStorage :  window.localStorage
      })

      
      const iconEyeTest = screen.queryAllByTestId('icon-eye')
      const handelClickIconEye = jest.fn(e => newBills.handleClickIconEye)
      iconEyeTest[3].addEventListener("click", handelClickIconEye)
      fireEvent.click(iconEyeTest[3])
      expect(handelClickIconEye).toHaveBeenCalled()

      const modale = document.getElementById('modaleFile')
      expect(modale).toBeTruthy()
  
    })


  })