import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })
    describe("When I load a proof file",() => {
      test("the extention file should be .jpg or .jpeg or .pnp",() => {
        const html = NewBillUI()
        document.body.innerHTML = html

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }

        const firebase = jest.fn()
        
        const newBill = new NewBill({
          document,
          onNavigate,
          firebase,
          localStorage : window.localStorage
        })

        const inputfile = "test.txt"
        const file = screen.getByTestId("file")
        const handleChangeFile = jest.fn(newBill.handleChangeFile)

        file.addEventListener("change", handleChangeFile)
        fireEvent.change(file, { target: {value : inputfile}})
        expect(handleChangeFile).toHaveBeenCalled()
      })
    })
  })
})