import { useState, useRef, useEffect } from 'react'
import { useDebouncyFn } from 'use-debouncy'
import Cell from './Cell'
import Picker from './Picker'
import '../styles/Grid.css'

function Grid({ size }) {
    const cell_amount = size ** 2
    
    // -- Setting state variables
    // Using map instead
    const [colours, setColours] = useState(new Map(
        Array.from({ length: cell_amount }, (_, idx) => {
            const xCoord = idx % size
            const yCoord = Math.floor(idx / size)
            return [xCoord + "," + yCoord, {
                userFilled: false,
                colour: "inherit"
            }]
        })
    ))
    
    // Picker States
    const [pickerMeta, updatePickerMeta] = useState(
        {
            coord: null,
            mousePos: {x: 0, y: 0},
            cellProp: null
        }
    )
    const [isPickerOpen, togglePicker] = useState(false)

    // Filled cells Set
    const [filledCells, updateFilledCells] = useState(new Set())
    
    // References
    const gridRef = useRef(null)
    const pickerRef = useRef(null)

    // Event Handlers

    // When Cell is clicked on
    function handleClick(coord, evt) {
        const prev_cell_props = colours.get(coord)
        const new_meta = {...pickerMeta}

        // change the picker's position based on the mouse's position relative to the page.
        new_meta.mousePos = {
            x: evt.pageX,
            y: evt.pageY
        }

        // change the cell referenced
        new_meta.coord = coord

        // change the referenced cell properties
        new_meta.cellProp = prev_cell_props

        updatePickerMeta(new_meta)
    }

    // When react-colorful picker detects changes
    const handlePickerChange = useDebouncyFn((coord, colour) => {
        console.log(coord, colour, pickerMeta)
        const next_meta = { ...pickerMeta }
        const new_filled_set = new Set(filledCells)

        // update colour in pickerMeta
        next_meta.cellProp.colour = colour

        // update colour Map
        const next_colours = new Map(colours)
        next_colours.get(coord).userFilled = true
        next_colours.get(coord).colour = colour

        // update filled colour set
        new_filled_set.add(coord)

        // update states
        setColours(next_colours)
        updatePickerMeta(next_meta)
        updateFilledCells(new_filled_set)
    }, 200)

    // TODO: Update the grid and fill in appropriate cells!
    useEffect(() => {
        if (!isPickerOpen) {
            console.log("Grid - TODO: Update the grid and fill in appropriate cells!")
        }
    }, [isPickerOpen])

    // -- Escaping React to check where the mouse is clicking on
    useEffect(() => {
        window.onclick = (event) => {
            if (!gridRef.current.contains(event.target) 
                && (pickerRef.current === null
                    || (pickerRef.current !== null && !pickerRef.current.contains(event.target))
                )
            ) {
                togglePicker(false)
            } else {
                togglePicker(true)
            }
        }
    }, [])

    // Generate the 10x10 grid, but futureproof for variable grid size
    const rows = []
    let row = []

    colours.forEach((colourProps, coord) => {
        const [x, y] = coord.split(",").map((n) => parseInt(n))
        
        // Add a cell to `row` array
        row.push(
            <Cell
                coord={coord}
                key={coord}
                properties={colourProps}
                onClick={handleClick}
            />
        )
        
        // End of the row? Add it to `rows` array
        if (x === (size - 1)) {
            rows.push(<div className="grid-row" key={"row_" + y}>{row}</div>)
            row = []
        }
    })

    return (
        <>
            <div className="grid" ref={gridRef}>{rows}</div>
            <Picker {...pickerMeta} ref={pickerRef} isActive={isPickerOpen} handleChange={handlePickerChange} />
        </>
    )
}

export default Grid