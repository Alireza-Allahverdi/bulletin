import AppBar from "../../components/appBar/AppBar"

function TermAndCondition() {
    return (
        <div>
            <AppBar innerText={"Terms and conditions"} navigateTo={-1} />
            <p style={{padding: 15, lineHeight: '1.7rem',fontSize: 19}}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem officia soluta repellat ab in expedita obcaecati cumque quaerat, error, amet porro, illum eos impedit! Ab nihil assumenda consectetur odio qui.
            </p>
        </div>
    )
}

export default TermAndCondition