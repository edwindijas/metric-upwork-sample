
const Result = {
    status: true,
    message: ''
}

export const DataStructure: iDataStructure = {
    name: {
        value: null,
        type: 'string',
        required: true
    },
    metric: {
        value: null,
        type: 'chars',
        required: true
    },
    pgn: {
        value: null,
        type: 'integer',
        label: "PGN",
        required: true
    },
    spn: {
        value: null,
        type: 'integer',
        label: "SPN",
        required: true
    },
    startByte: {
        value: null,
        type: 'integer',
        label: 'start byte'
    },
    startBit: {
        value: null,
        type: 'integer',
        label: 'start bit'
    },
    length: {
        value: null,
        type: 'integer',
        label: 'start bit'
    },
    unit: {
        value: null,
        type: 'string'
    },
    scaling: {
        value: null,
        type: 'string'
    },
    lowerLimit: {
        value: null,
        type: 'float',
        label: 'lower limit'
    },
    upperLimit: {
        value: null,
        type: 'float',
        label: 'upper limit'
    },
    offset: {
        value: null,
        type: 'float',
    },
    desiredInterval: {
        value: null,
        type: 'integer',
        label: 'desired interval'
    },
    state: {
        value: null,
        type: 'string'
    },
    

}

interface iDataStructure {
    [name: string]: iInternal
}

interface iInternal {
    value: number | string | null,
    type: 'string' | 'chars' | 'float' | 'integer' | 'boolean';
    label?: string,
    required?: boolean
}

export interface iData {
    [name: string]: string
}