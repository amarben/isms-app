import { vi } from 'vitest'

// Mock all recharts components
export const ResponsiveContainer = ({ children }: any) => <div data-testid="responsive-container">{children}</div>
export const PieChart = ({ children }: any) => <div data-testid="pie-chart">{children}</div>
export const Pie = () => <div data-testid="pie" />
export const Cell = () => <div data-testid="cell" />
export const BarChart = ({ children }: any) => <div data-testid="bar-chart">{children}</div>
export const Bar = () => <div data-testid="bar" />
export const XAxis = () => <div data-testid="x-axis" />
export const YAxis = () => <div data-testid="y-axis" />
export const CartesianGrid = () => <div data-testid="cartesian-grid" />
export const Tooltip = () => <div data-testid="tooltip" />
export const Legend = () => <div data-testid="legend" />
