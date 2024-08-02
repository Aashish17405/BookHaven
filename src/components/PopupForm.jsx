function PopupForm(){
    return <div>
        <div className="border border-grey-500 flex align-center">
            <label>Name:<input type="text" placeholder="name" autoComplete="none"/></label>
            <label>Phone:<input type="digit" placeholder="Phone number" autoComplete="none"/></label>
        </div>
    </div>
}
export default PopupForm;