export enum ElevatorDirection {
  up = 'up',
  down = 'down',
}
export enum ElevatorStatus {
  Idle = 'Idle',
  Running = 'Running',
}

export interface FloorRequest {
  floor: number
  isGoingUp: boolean
  dropUser: boolean
}
