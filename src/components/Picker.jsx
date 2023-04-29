import { forwardRef } from 'react'
import { HexColorPicker, HexColorInput } from 'react-colorful'

/* function Picker(popover, color, onChange) {
    return (
        <div className="popover" ref={popover}>
            <HexColorPicker color={color} onChange={onChange} />
        </div>
    )
} */
const Picker = forwardRef( ({pos, colour, isActive}, ref) => {
    return (
        <>
            {isActive && (
            <div className="colour-picker" style={{ left: pos.x + "px", top: pos.y + "px" }} ref={ref}>
                <p>Position: {pos.x}, {pos.y}</p>
                <p>Colour: {colour}</p>
            </div>)}
        </>
    )
})

Picker.displayName = 'Picker'

export default Picker