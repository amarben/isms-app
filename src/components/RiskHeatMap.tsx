import React, { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'

interface Risk {
  id: string
  title: string
  likelihood: number
  impact: number
  riskLevel: string
  category?: string
}

interface RiskHeatMapProps {
  risks: Risk[]
  onRiskClick?: (risk: Risk) => void
}

const RiskHeatMap: React.FC<RiskHeatMapProps> = ({ risks, onRiskClick }) => {
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null)
  const [hoveredCell, setHoveredCell] = useState<{likelihood: number, impact: number} | null>(null)

  const likelihoodLabels = [
    { value: 5, label: 'Very High' },
    { value: 4, label: 'High' },
    { value: 3, label: 'Medium' },
    { value: 2, label: 'Low' },
    { value: 1, label: 'Very Low' }
  ]

  const impactLabels = [
    { value: 1, label: 'Very Low' },
    { value: 2, label: 'Low' },
    { value: 3, label: 'Medium' },
    { value: 4, label: 'High' },
    { value: 5, label: 'Very High' }
  ]

  const getRiskScore = (likelihood: number, impact: number): number => {
    return likelihood * impact
  }

  const getRiskLevel = (score: number): string => {
    if (score >= 20) return 'critical'
    if (score >= 15) return 'high'
    if (score >= 8) return 'medium'
    return 'low'
  }

  const getCellColor = (likelihood: number, impact: number): string => {
    const score = getRiskScore(likelihood, impact)
    const level = getRiskLevel(score)

    switch (level) {
      case 'critical':
        return 'bg-red-600 hover:bg-red-700'
      case 'high':
        return 'bg-orange-500 hover:bg-orange-600'
      case 'medium':
        return 'bg-yellow-400 hover:bg-yellow-500'
      case 'low':
        return 'bg-green-400 hover:bg-green-500'
      default:
        return 'bg-gray-300 hover:bg-gray-400'
    }
  }

  const getRisksInCell = (likelihood: number, impact: number): Risk[] => {
    return risks.filter(r => r.likelihood === likelihood && r.impact === impact)
  }

  const handleCellClick = (likelihood: number, impact: number) => {
    const cellRisks = getRisksInCell(likelihood, impact)
    if (cellRisks.length > 0) {
      setSelectedRisk(cellRisks[0])
      if (onRiskClick) {
        onRiskClick(cellRisks[0])
      }
    }
  }

  const getRiskLevelStats = () => {
    const stats = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    }

    risks.forEach(risk => {
      const score = getRiskScore(risk.likelihood, risk.impact)
      const level = getRiskLevel(score)
      stats[level as keyof typeof stats]++
    })

    return stats
  }

  const stats = getRiskLevelStats()

  return (
    <div className="space-y-6">
      {/* Legend and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Risk Distribution</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-red-600"></div>
                <span className="text-sm text-gray-700">Critical (20-25)</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{stats.critical}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-orange-500"></div>
                <span className="text-sm text-gray-700">High (15-19)</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{stats.high}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-yellow-400"></div>
                <span className="text-sm text-gray-700">Medium (8-14)</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{stats.medium}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-green-400"></div>
                <span className="text-sm text-gray-700">Low (1-7)</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{stats.low}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Total Risks</h4>
          <div className="text-4xl font-bold text-gray-900 mb-2">{risks.length}</div>
          <div className="text-sm text-gray-600">
            {stats.critical + stats.high} require immediate attention
          </div>
        </div>
      </div>

      {/* Heat Map */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Risk Heat Map</h4>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="w-24 h-12 text-xs font-semibold text-gray-700"></th>
                  {impactLabels.map(impact => (
                    <th key={impact.value} className="w-24 h-12 text-xs font-semibold text-gray-700 text-center">
                      <div>{impact.label}</div>
                      <div className="text-gray-500">({impact.value})</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {likelihoodLabels.map(likelihood => (
                  <tr key={likelihood.value}>
                    <td className="w-24 h-24 text-xs font-semibold text-gray-700 text-right pr-3">
                      <div>{likelihood.label}</div>
                      <div className="text-gray-500">({likelihood.value})</div>
                    </td>
                    {impactLabels.map(impact => {
                      const cellRisks = getRisksInCell(likelihood.value, impact.value)
                      const score = getRiskScore(likelihood.value, impact.value)
                      const isHovered = hoveredCell?.likelihood === likelihood.value && hoveredCell?.impact === impact.value

                      return (
                        <td
                          key={`${likelihood.value}-${impact.value}`}
                          className="w-24 h-24 border border-gray-300 relative"
                        >
                          <div
                            className={`absolute inset-0 ${getCellColor(likelihood.value, impact.value)} transition-all cursor-pointer ${
                              isHovered ? 'scale-95' : ''
                            }`}
                            onClick={() => handleCellClick(likelihood.value, impact.value)}
                            onMouseEnter={() => setHoveredCell({likelihood: likelihood.value, impact: impact.value})}
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                              <div className="text-xs font-bold">{score}</div>
                              {cellRisks.length > 0 && (
                                <div className="mt-1">
                                  <div className="w-8 h-8 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                                    <span className="text-sm font-bold">{cellRisks.length}</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Tooltip on hover */}
                            {isHovered && cellRisks.length > 0 && (
                              <div className="absolute z-10 top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
                                <div className="font-semibold mb-1">{cellRisks.length} Risk(s)</div>
                                <div className="space-y-1">
                                  {cellRisks.slice(0, 3).map(risk => (
                                    <div key={risk.id} className="text-xs truncate">
                                      • {risk.title}
                                    </div>
                                  ))}
                                  {cellRisks.length > 3 && (
                                    <div className="text-xs text-gray-300">
                                      +{cellRisks.length - 3} more...
                                    </div>
                                  )}
                                </div>
                                <div className="mt-1 text-xs text-gray-300">Click to view details</div>
                              </div>
                            )}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Axis Labels */}
            <div className="mt-2 text-center">
              <div className="text-sm font-semibold text-gray-700">Impact →</div>
            </div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90">
              <div className="text-sm font-semibold text-gray-700 whitespace-nowrap">← Likelihood</div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Details Modal */}
      {selectedRisk && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedRisk.title}</h3>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedRisk.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                    selectedRisk.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                    selectedRisk.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedRisk.riskLevel.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-600">Risk Score: {getRiskScore(selectedRisk.likelihood, selectedRisk.impact)}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRisk(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Likelihood</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {likelihoodLabels.find(l => l.value === selectedRisk.likelihood)?.label} ({selectedRisk.likelihood})
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Impact</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {impactLabels.find(i => i.value === selectedRisk.impact)?.label} ({selectedRisk.impact})
                  </div>
                </div>
              </div>

              {selectedRisk.category && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Category</div>
                  <div className="text-gray-900">{selectedRisk.category}</div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedRisk(null)
                    if (onRiskClick) {
                      onRiskClick(selectedRisk)
                    }
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Full Risk Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {risks.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Risks to Display</h3>
          <p className="text-gray-600">
            Complete the Risk Assessment step to populate the heat map with identified risks.
          </p>
        </div>
      )}
    </div>
  )
}

export default RiskHeatMap
