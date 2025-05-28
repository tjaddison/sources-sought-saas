'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Create an inline SVG component for the arrow icon
const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
)

export default function ROICalculator() {
  // User inputs
  const [hoursPerResponse, setHoursPerResponse] = useState(2.5);
  const [responseCount, setResponseCount] = useState(5);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [hourlyRate, setHourlyRate] = useState(75);
  
  // GovBiz Agent parameters
  const timeReductionPercentage = 0.8; // 80% time reduction
  const monthlyPlanCost = 99; // $99/month for Agent Pro plan
  
  // Calculated results - removing unused variables
  // const [responsesPerMonth, setResponsesPerMonth] = useState(0);
  // const [responsesPerYear, setResponsesPerYear] = useState(0);
  const [manualHoursPerMonth, setManualHoursPerMonth] = useState(0);
  const [manualCostPerMonth, setManualCostPerMonth] = useState(0);
  const [agentHoursPerMonth, setAgentHoursPerMonth] = useState(0);
  // const [agentHumanCostPerMonth, setAgentHumanCostPerMonth] = useState(0);
  const [totalCostWithAgentPerMonth, setTotalCostWithAgentPerMonth] = useState(0);
  const [timeSavedPerMonth, setTimeSavedPerMonth] = useState(0);
  const [costSavedPerMonth, setCostSavedPerMonth] = useState(0);
  const [roiPercentage, setRoiPercentage] = useState(0);
  
  // Annual calculations
  const [manualCostPerYear, setManualCostPerYear] = useState(0);
  const [totalCostWithAgentPerYear, setTotalCostWithAgentPerYear] = useState(0);
  const [timeSavedPerYear, setTimeSavedPerYear] = useState(0);
  const [costSavedPerYear, setCostSavedPerYear] = useState(0);
  
  // View toggle
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  
  // Calculate results when inputs change
  useEffect(() => {
    // Normalize response frequency to monthly and yearly
    let monthlyResponses = responseCount;
    switch (timeframe) {
      case 'day':
        monthlyResponses = responseCount * 22; // Assuming 22 working days per month
        break;
      case 'week':
        monthlyResponses = responseCount * 4.33; // Average weeks per month
        break;
      case 'year':
        monthlyResponses = responseCount / 12;
        break;
    }
    
    const yearlyResponses = monthlyResponses * 12;
    
    // Manual process calculations
    const manualHoursMonthly = monthlyResponses * hoursPerResponse;
    const manualCostMonthly = manualHoursMonthly * hourlyRate;
    
    // GovBiz Agent calculations
    const hoursPerResponseWithAgent = hoursPerResponse * (1 - timeReductionPercentage);
    const agentHoursMonthly = monthlyResponses * hoursPerResponseWithAgent;
    const agentHumanCostMonthly = agentHoursMonthly * hourlyRate;
    const totalCostWithAgentMonthly = agentHumanCostMonthly + monthlyPlanCost;
    
    // Savings calculations
    const timeSavedMonthly = manualHoursMonthly - agentHoursMonthly;
    const costSavedMonthly = manualCostMonthly - totalCostWithAgentMonthly;
    const roiPercentageCalc = monthlyPlanCost > 0 ? (costSavedMonthly / monthlyPlanCost) * 100 : 0;
    
    // Annual calculations
    const manualCostYearly = manualCostMonthly * 12;
    const totalCostWithAgentYearly = totalCostWithAgentMonthly * 12;
    const timeSavedYearly = timeSavedMonthly * 12;
    const costSavedYearly = costSavedMonthly * 12;
    
    // Update states with calculated values
    // setResponsesPerMonth(monthlyResponses);
    // setResponsesPerYear(yearlyResponses);
    setManualHoursPerMonth(manualHoursMonthly);
    setManualCostPerMonth(manualCostMonthly);
    setAgentHoursPerMonth(agentHoursMonthly);
    // setAgentHumanCostPerMonth(agentHumanCostMonthly);
    setTotalCostWithAgentPerMonth(totalCostWithAgentMonthly);
    setTimeSavedPerMonth(timeSavedMonthly);
    setCostSavedPerMonth(costSavedMonthly);
    setRoiPercentage(roiPercentageCalc);
    setManualCostPerYear(manualCostYearly);
    setTotalCostWithAgentPerYear(totalCostWithAgentYearly);
    setTimeSavedPerYear(timeSavedYearly);
    setCostSavedPerYear(costSavedYearly);
  }, [hoursPerResponse, responseCount, timeframe, hourlyRate]);

  // Define a proper type for timeframe instead of using 'any'
  const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeframe(e.target.value as 'day' | 'week' | 'month' | 'year');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
        Sources Sought Efficiency Calculator
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">The Manual Way</h3>
          
          {/* Hours per response slider */}
          <div className="mb-6">
            <label htmlFor="hoursPerResponse" className="block text-sm font-medium text-gray-700 mb-2">
              On average, how many hours do you/your team spend per Sources Sought notice?
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                id="hoursPerResponse"
                min="0.5"
                max="10"
                step="0.5"
                value={hoursPerResponse}
                onChange={(e) => setHoursPerResponse(parseFloat(e.target.value))}
                className="flex-grow h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
              />
              <div className="w-24 flex items-center">
                <input
                  type="number"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={hoursPerResponse}
                  onChange={(e) => setHoursPerResponse(parseFloat(e.target.value))}
                  className="w-full px-2 py-1 text-center border border-gray-300 rounded-md text-gray-700"
                />
                <span className="ml-1 text-gray-600">hrs</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Including finding, reading, analyzing, and drafting a response.
            </p>
          </div>
          
          {/* Response count and frequency */}
          <div className="mb-6">
            <label htmlFor="responseCount" className="block text-sm font-medium text-gray-700 mb-2">
              How many Sources Sought notices do you/your team typically respond to?
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                id="responseCount"
                min="1"
                max="100"
                value={responseCount}
                onChange={(e) => setResponseCount(parseInt(e.target.value))}
                className="w-20 px-2 py-1 text-center border border-gray-300 rounded-md text-gray-700"
              />
              <select
                value={timeframe}
                onChange={handleTimeframeChange}
                className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700"
              >
                <option value="day">per Day</option>
                <option value="week">per Week</option>
                <option value="month">per Month</option>
                <option value="year">per Year</option>
              </select>
            </div>
          </div>
          
          {/* Hourly rate slider */}
          <div className="mb-6">
            <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-2">
              What is the estimated hourly value/cost of the person(s) doing this work?
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                id="hourlyRate"
                min="25"
                max="150"
                step="5"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                className="flex-grow h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
              />
              <div className="w-20 flex items-center">
                <span className="mr-1 text-gray-600">$</span>
                <input
                  type="number"
                  min="25"
                  max="150"
                  step="5"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                  className="w-full px-2 py-1 text-center border border-gray-300 rounded-md text-gray-700"
                />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Consider salary, benefits, overhead, or consultant costs.
            </p>
          </div>
          
          {/* GovBiz Agent info */}
          <div className="mt-8 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-700 mb-2">The GovBiz Agent Way</h4>
            <p className="text-sm text-gray-600 mb-1">
              GovBiz Agent typically reduces the time spent per notice by <strong className="text-blue-700">80%</strong>.
            </p>
            <p className="text-sm text-gray-600">
              Comparison based on our &apos;Agent Pro&apos; plan at <strong className="text-blue-700">${monthlyPlanCost}/month</strong>.
            </p>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Your Potential Savings</h3>
            <div className="flex border border-blue-300 rounded-lg overflow-hidden">
              <button 
                className={`px-3 py-1 text-sm ${viewMode === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
                onClick={() => setViewMode('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`px-3 py-1 text-sm ${viewMode === 'yearly' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
                onClick={() => setViewMode('yearly')}
              >
                Yearly
              </button>
            </div>
          </div>
          
          {/* Comparison Results */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Manual Process</h4>
              <p className="text-lg font-bold text-gray-800 mb-1">
                {viewMode === 'monthly' ? 
                  `${manualHoursPerMonth.toFixed(1)} hours` : 
                  `${(manualHoursPerMonth * 12).toFixed(1)} hours`}
              </p>
              <p className="text-lg font-bold text-gray-800">
                ${viewMode === 'monthly' ? 
                  manualCostPerMonth.toFixed(0) : 
                  manualCostPerYear.toFixed(0)}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-500 mb-2">With GovBiz Agent</h4>
              <p className="text-lg font-bold text-green-600 mb-1">
                {viewMode === 'monthly' ? 
                  `${agentHoursPerMonth.toFixed(1)} hours` : 
                  `${(agentHoursPerMonth * 12).toFixed(1)} hours`}
              </p>
              <p className="text-lg font-bold text-green-600">
                ${viewMode === 'monthly' ? 
                  totalCostWithAgentPerMonth.toFixed(0) : 
                  totalCostWithAgentPerYear.toFixed(0)}
              </p>
            </div>
          </div>
          
          {/* Highlighted Savings */}
          <div className="border-2 border-blue-500 rounded-lg p-4 mb-6 bg-white">
            <h4 className="text-center font-semibold text-blue-700 mb-4">YOUR SAVINGS</h4>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Time Saved:</span>
                <span className="text-xl font-bold text-blue-700">
                  {viewMode === 'monthly' ? 
                    `${timeSavedPerMonth.toFixed(1)} hours` : 
                    `${timeSavedPerYear.toFixed(1)} hours`}
                  {viewMode === 'monthly' ? ' per month' : ' per year'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Cost Saved:</span>
                <span className="text-xl font-bold text-green-600">
                  ${viewMode === 'monthly' ? 
                    costSavedPerMonth.toFixed(0) : 
                    costSavedPerYear.toFixed(0)}
                  {viewMode === 'monthly' ? ' per month' : ' per year'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700">ROI:</span>
                <span className="text-xl font-bold text-purple-600">
                  {roiPercentage.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Visualization */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Hours Comparison</h4>
            <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-blue-600 flex items-center justify-end px-2"
                style={{ width: `${100 - (agentHoursPerMonth / manualHoursPerMonth * 100)}%` }}
              >
                <span className="text-xs text-white font-medium">{(timeSavedPerMonth / manualHoursPerMonth * 100).toFixed(0)}% less time</span>
              </div>
            </div>
          </div>
          
          {/* Interpretive Text */}
          <p className="text-gray-700 mb-6">
            Imagine what you could do with an extra {timeSavedPerMonth.toFixed(1)} hours each month! GovBiz Agent doesn&apos;t just save you money, it frees you up to focus on winning contracts.
          </p>
          
          {/* Call to Action */}
          <div className="flex flex-col space-y-3">
            <Link href="/waitlist" className="flex justify-center items-center py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              Start Saving Now - Join Waitlist
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/pricing" className="text-center py-2 px-6 border border-blue-300 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
              See Plans & Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 