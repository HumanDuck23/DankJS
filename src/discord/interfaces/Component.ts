export interface Component {
    type: number,
    label?: string,
    custom_id?: string,
    components?: Component[]
}