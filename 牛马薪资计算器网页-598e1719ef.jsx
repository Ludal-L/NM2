import React, { useState, useEffect } from 'react';
import { Clock, DollarSign, Calendar, Coffee, Plus, Trash2, Clock3, Clock9 } from 'lucide-react';
import { motion } from 'framer-motion';

const SalaryCalculator = () => {
  const [monthlySalary, setMonthlySalary] = useState(20000);
  const [workDays, setWorkDays] = useState(22);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [lunchStart, setLunchStart] = useState('12:00');
  const [lunchEnd, setLunchEnd] = useState('13:30');
  const [currentTime, setCurrentTime] = useState('');
  const [earningsPerSecond, setEarningsPerSecond] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [additionalIncomes, setAdditionalIncomes] = useState([]);
  const [newIncomeType, setNewIncomeType] = useState('bonus');
  const [newIncomeAmount, setNewIncomeAmount] = useState(0);
  const [isWorkingHour, setIsWorkingHour] = useState(false);

  // 计算每秒收入
  useEffect(() => {
    const calculateEarnings = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('zh-CN'));

      const start = new Date();
      const [startHour, startMinute] = startTime.split(':').map(Number);
      start.setHours(startHour, startMinute, 0, 0);

      const end = new Date();
      const [endHour, endMinute] = endTime.split(':').map(Number);
      end.setHours(endHour, endMinute, 0, 0);

      const lunchS = new Date();
      const [lunchSHour, lunchSMinute] = lunchStart.split(':').map(Number);
      lunchS.setHours(lunchSHour, lunchSMinute, 0, 0);

      const lunchE = new Date();
      const [lunchEHour, lunchEMinute] = lunchEnd.split(':').map(Number);
      lunchE.setHours(lunchEHour, lunchEMinute, 0, 0);

      // 检查是否是工作日
      const dayOfWeek = now.getDay();
      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

      // 检查是否是工作时间
      const isWorkingTime = now >= start && now <= end && !(now >= lunchS && now <= lunchE);
      setIsWorkingHour(isWeekday && isWorkingTime);

      if (isWeekday && isWorkingTime) {
        // 计算每日工作时间（秒）
        const workSeconds = ((end - start) - (lunchE - lunchS)) / 1000;
        
        // 计算日薪
        const dailySalary = monthlySalary / workDays;
        
        // 计算每秒收入
        const perSecond = dailySalary / workSeconds;
        setEarningsPerSecond(perSecond);

        // 计算今日已赚
        const secondsWorkedToday = (now - start) / 1000;
        const lunchBreakSeconds = now >= lunchS && now < lunchE ? (now - lunchS) / 1000 : 0;
        const adjustedSecondsWorked = secondsWorkedToday - lunchBreakSeconds;
        setTodayEarnings(adjustedSecondsWorked * perSecond);
      } else {
        setEarningsPerSecond(0);
      }
    };

    calculateEarnings();
    const interval = setInterval(calculateEarnings, 1000);
    return () => clearInterval(interval);
  }, [monthlySalary, workDays, startTime, endTime, lunchStart, lunchEnd]);

  // 添加额外收入
  const addAdditionalIncome = () => {
    if (newIncomeAmount <= 0) return;
    
    const newIncome = {
      id: Date.now(),
      type: newIncomeType,
      amount: parseFloat(newIncomeAmount),
      date: new Date().toLocaleString('zh-CN')
    };
    
    setAdditionalIncomes([...additionalIncomes, newIncome]);
    setNewIncomeAmount(0);
  };

  // 删除收入记录
  const removeIncome = (id) => {
    setAdditionalIncomes(additionalIncomes.filter(income => income.id !== id));
  };

  // 计算总收入
  const totalAdditionalIncome = additionalIncomes.reduce((sum, income) => sum + income.amount, 0);
  const totalEarnings = todayEarnings + totalAdditionalIncome;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 标题区 */}
      <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center px-10 shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <DollarSign className="mr-2" /> 牛马薪资计算器
          </h1>
          <p className="text-yellow-300 text-sm mt-1 flex items-center">
            打工不怕苦，鲁总帮你数
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* 输入控制区 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="mr-2" /> 基本设置
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">月薪（元）</label>
              <input
                type="number"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">每月工作日</label>
              <input
                type="number"
                min="1"
                max="31"
                value={workDays}
                onChange={(e) => setWorkDays(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">上班时间</label>
              <div className="relative">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Clock9 className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">下班时间</label>
              <div className="relative">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Clock3 className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* 实时收入区 */}
        <motion.div 
          className={`rounded-xl p-6 mb-6 ${isWorkingHour ? 'bg-blue-50' : 'bg-gray-100'}`}
          animate={{ 
            backgroundColor: isWorkingHour ? 'rgba(74, 144, 226, 0.1)' : 'rgba(226, 232, 240, 1)',
            scale: [1, 1.01, 1]
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-600 flex items-center">
              <Clock className="mr-1" /> {currentTime}
            </p>
            <span className={`px-2 py-1 rounded-full text-xs ${isWorkingHour ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
              {isWorkingHour ? '工作中' : '休息中'}
            </span>
          </div>
          
          <div className="text-center py-4">
            <p className="text-gray-600 mb-1">正在赚取</p>
            <motion.p 
              className="text-4xl font-bold text-gray-800"
              key={earningsPerSecond}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              ¥{(earningsPerSecond ?? 0).toFixed(4)}/秒
            </motion.p>
            <p className="text-blue-600 text-xl mt-4">
              今日已赚: ¥{todayEarnings.toFixed(2)}
            </p>
          </div>
        </motion.div>

        {/* 午休设置 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Coffee className="mr-2" /> 午休时间设置
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">午休开始</label>
              <div className="relative">
                <input
                  type="time"
                  value={lunchStart}
                  onChange={(e) => setLunchStart(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Clock className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">午休结束</label>
              <div className="relative">
                <input
                  type="time"
                  value={lunchEnd}
                  onChange={(e) => setLunchEnd(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Clock className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* 额外收入 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Plus className="mr-2" /> 额外收入记录
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">收入类型</label>
              <select
                value={newIncomeType}
                onChange={(e) => setNewIncomeType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="bonus">奖金</option>
                <option value="overtime">加班费</option>
                <option value="allowance">补贴</option>
                <option value="other">其他</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">金额（元）</label>
              <input
                type="number"
                value={newIncomeAmount}
                onChange={(e) => setNewIncomeAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={addAdditionalIncome}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Plus className="mr-1" /> 添加记录
              </button>
            </div>
          </div>
          
          {additionalIncomes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">收入记录</h3>
              <div className="space-y-3">
                {additionalIncomes.map((income) => (
                  <motion.div
                    key={income.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <span className="font-medium">
                        {income.type === 'bonus' && '奖金'}
                        {income.type === 'overtime' && '加班费'}
                        {income.type === 'allowance' && '补贴'}
                        {income.type === 'other' && '其他收入'}
                      </span>
                      <span className="text-blue-600 ml-2">¥{income.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 text-sm mr-3">{income.date}</span>
                      <button
                        onClick={() => removeIncome(income.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 统计区 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">今日收入统计</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600">工资收入</p>
              <p className="text-2xl font-bold">¥{todayEarnings.toFixed(2)}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-600">额外收入</p>
              <p className="text-2xl font-bold">¥{totalAdditionalIncome.toFixed(2)}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-600">总收入</p>
              <p className="text-2xl font-bold">¥{totalEarnings.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-4 text-center text-sm">
        <div className="container mx-auto">
          <p>created by <a href="https://space.coze.cn" className="text-blue-300 hover:underline">coze space</a></p>
          <p className="text-gray-400 mt-1">页面内容均由 AI 生成，仅供参考</p>
        </div>
      </footer>
    </div>
  );
};

export default SalaryCalculator;