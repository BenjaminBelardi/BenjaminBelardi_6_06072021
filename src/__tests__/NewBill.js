import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("all form data is populate before new bill send", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const inputData = {
        email: "johndoe@email.com"
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

      // localStorage should be populated with form data
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null)
        },
        writable: true
      })

      const firestore = null

      const newBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage
      })

      const form = screen.getByTestId("form-new-bill")
      const handleSubmit = jest.fn(newBill.handleSubmit)

      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
      // expect(window.localStorage.getItem).toHaveBeenCalledWith(
      //   "user",
      //   JSON.stringify({
      //     type: "Employee",
      //     email: inputData.email
      //   })
      //)


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
})

