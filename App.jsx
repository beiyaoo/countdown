import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Heart, Clock, MessageCircle, Settings, Sun, Moon, Calendar, RotateCcw, Play, Lock, Unlock, Key, Eye, EyeOff, Trash2, Shield, Plus, GripVertical, X, Edit, Palette, Pin, PinOff } from 'lucide-react'
import './App.css'

function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState({ name: '', content: '', isPrivate: false })
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isCountUp, setIsCountUp] = useState(false)
  const [targetDate, setTargetDate] = useState('')
  const [endMessage, setEndMessage] = useState('时间到了！🎉')
  const [showSettings, setShowSettings] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authKey, setAuthKey] = useState('')
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showPrivateMessages, setShowPrivateMessages] = useState(false)
  const [showSettingsAuthDialog, setShowSettingsAuthDialog] = useState(false)
  const [settingsAuthKey, setSettingsAuthKey] = useState('')
  
  // 多倒计时相关状态
  const [additionalCountdowns, setAdditionalCountdowns] = useState([])
  const [showAddCountdownDialog, setShowAddCountdownDialog] = useState(false)
  const [newCountdown, setNewCountdown] = useState({
    title: '',
    targetDate: '',
    endMessage: '时间到了！',
    isCountUp: false,
    backgroundColor: 'default'
  })
  const [draggedItem, setDraggedItem] = useState(null)
  const [editingCountdown, setEditingCountdown] = useState(null)
  const [showEditCountdownDialog, setShowEditCountdownDialog] = useState(false)

  // 默认密钥（实际应用中应该更安全）
  const ADMIN_KEY = 'admin2025'

  // 背景颜色选项
  const backgroundOptions = [
    { value: 'default', label: '默认', class: '' },
    { value: 'blue', label: '蓝色', class: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30' },
    { value: 'green', label: '绿色', class: 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30' },
    { value: 'purple', label: '紫色', class: 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30' },
    { value: 'pink', label: '粉色', class: 'bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30' },
    { value: 'orange', label: '橙色', class: 'bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30' },
    { value: 'yellow', label: '黄色', class: 'bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30' },
    { value: 'red', label: '红色', class: 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30' },
    { value: 'gray', label: '灰色', class: 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700/30 dark:to-gray-600/30' }
  ]

  // 初始化设置
  useEffect(() => {
    // 从本地存储加载设置
    const savedSettings = localStorage.getItem('countdown-settings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setIsDarkMode(settings.isDarkMode || false)
      setIsCountUp(settings.isCountUp || false)
      setTargetDate(settings.targetDate || getDefaultGaokaoDate())
      setEndMessage(settings.endMessage || '时间到了！🎉')
    } else {
      setTargetDate(getDefaultGaokaoDate())
    }

    // 从本地存储加载多倒计时
    const savedCountdowns = localStorage.getItem('additional-countdowns')
    if (savedCountdowns) {
      setAdditionalCountdowns(JSON.parse(savedCountdowns))
    }

    // 从本地存储加载主题
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }

    // 检查认证状态
    const savedAuth = localStorage.getItem('auth-status')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  // 获取默认高考日期
  const getDefaultGaokaoDate = () => {
    const now = new Date()
    const currentYear = now.getFullYear()
    let gaokaoDate = new Date(currentYear, 5, 7, 9, 0) // 6月7日上午9点
    
    if (now > gaokaoDate) {
      gaokaoDate = new Date(currentYear + 1, 5, 7, 9, 0)
    }
    
    return gaokaoDate.toISOString().slice(0, 16)
  }

  // 保存设置到本地存储
  const saveSettings = (settings) => {
    localStorage.setItem('countdown-settings', JSON.stringify(settings))
  }

  // 保存多倒计时到本地存储
  const saveAdditionalCountdowns = (countdowns) => {
    localStorage.setItem('additional-countdowns', JSON.stringify(countdowns))
  }

  // 切换主题
  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
    
    saveSettings({ isDarkMode: newTheme, isCountUp, targetDate, endMessage })
  }

  // 切换计时模式
  const toggleCountMode = () => {
    const newMode = !isCountUp
    setIsCountUp(newMode)
    saveSettings({ isDarkMode, isCountUp: newMode, targetDate, endMessage })
  }

  // 更新目标日期
  const updateTargetDate = (newDate) => {
    setTargetDate(newDate)
    saveSettings({ isDarkMode, isCountUp, targetDate: newDate, endMessage })
  }

  // 更新结束消息
  const updateEndMessage = (newMessage) => {
    setEndMessage(newMessage)
    saveSettings({ isDarkMode, isCountUp, targetDate, endMessage: newMessage })
  }

  // 添加新倒计时
  const addCountdown = () => {
    if (!newCountdown.title.trim() || !newCountdown.targetDate) {
      alert('请填写标题和目标日期')
      return
    }

    const countdown = {
      id: Date.now(),
      title: newCountdown.title.trim(),
      targetDate: newCountdown.targetDate,
      endMessage: newCountdown.endMessage.trim() || '时间到了！',
      isCountUp: newCountdown.isCountUp,
      backgroundColor: newCountdown.backgroundColor,
      order: additionalCountdowns.length
    }

    const updatedCountdowns = [...additionalCountdowns, countdown]
    setAdditionalCountdowns(updatedCountdowns)
    saveAdditionalCountdowns(updatedCountdowns)
    setNewCountdown({ title: '', targetDate: '', endMessage: '时间到了！', isCountUp: false, backgroundColor: 'default' })
    setShowAddCountdownDialog(false)
  }

  // 编辑倒计时
  const editCountdown = (countdown) => {
    setEditingCountdown({ ...countdown })
    setShowEditCountdownDialog(true)
  }

  // 保存编辑的倒计时
  const saveEditedCountdown = () => {
    if (!editingCountdown.title.trim() || !editingCountdown.targetDate) {
      alert('请填写标题和目标日期')
      return
    }

    const updatedCountdowns = additionalCountdowns.map(c => 
      c.id === editingCountdown.id ? editingCountdown : c
    )
    setAdditionalCountdowns(updatedCountdowns)
    saveAdditionalCountdowns(updatedCountdowns)
    setShowEditCountdownDialog(false)
    setEditingCountdown(null)
  }

  // 删除倒计时
  const deleteCountdown = (id) => {
    if (window.confirm('确定要删除这个倒计时吗？')) {
      const updatedCountdowns = additionalCountdowns.filter(c => c.id !== id)
      setAdditionalCountdowns(updatedCountdowns)
      saveAdditionalCountdowns(updatedCountdowns)
    }
  }

  // 拖拽排序
  const handleDragStart = (e, index) => {
    setDraggedItem(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    
    if (draggedItem === null || draggedItem === dropIndex) return

    const newCountdowns = [...additionalCountdowns]
    const draggedCountdown = newCountdowns[draggedItem]
    
    // 移除拖拽的项目
    newCountdowns.splice(draggedItem, 1)
    
    // 在新位置插入
    newCountdowns.splice(dropIndex, 0, draggedCountdown)
    
    // 更新order字段
    newCountdowns.forEach((countdown, index) => {
      countdown.order = index
    })

    setAdditionalCountdowns(newCountdowns)
    saveAdditionalCountdowns(newCountdowns)
    setDraggedItem(null)
  }

  // 认证验证
  const handleAuth = () => {
    if (authKey === ADMIN_KEY) {
      setIsAuthenticated(true)
      localStorage.setItem('auth-status', 'true')
      setShowAuthDialog(false)
      setAuthKey('')
      alert('认证成功！现在可以查看私密留言。')
    } else {
      alert('密钥错误，请重试。')
    }
  }

  // 设置面板认证验证
  const handleSettingsAuth = () => {
    if (settingsAuthKey === ADMIN_KEY) {
      setShowSettingsAuthDialog(false)
      setSettingsAuthKey('')
      setShowSettings(true)
    } else {
      alert('密钥错误，请重试。')
    }
  }

  // 显示设置面板（需要认证）
  const showSettingsPanel = () => {
    setShowSettingsAuthDialog(true)
  }

  // 退出认证
  const handleLogout = () => {
    setIsAuthenticated(false)
    setShowPrivateMessages(false)
    localStorage.removeItem('auth-status')
  }

  // 删除留言
  const deleteMessage = (messageId) => {
    if (window.confirm('确定要删除这条留言吗？')) {
      const updatedMessages = messages.filter(msg => msg.id !== messageId)
      setMessages(updatedMessages)
      saveMessages(updatedMessages)
    }
  }

  // 置顶/取消置顶留言
  const togglePinMessage = (messageId) => {
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
    )
    setMessages(updatedMessages)
    saveMessages(updatedMessages)
  }

  // 计算时间差
  const calculateTimeDifference = (targetDate, isCountUp) => {
    if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: false }

    const now = new Date()
    const target = new Date(targetDate)
    
    let difference
    if (isCountUp) {
      // 正计时：从目标日期开始计算已过去的时间
      difference = now - target
    } else {
      // 倒计时：计算到目标日期的剩余时间
      difference = target - now
    }
    
    const isFinished = !isCountUp && difference <= 0
    const absDifference = Math.abs(difference)
    
    if (absDifference > 0) {
      return {
        days: Math.floor(absDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((absDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((absDifference / 1000 / 60) % 60),
        seconds: Math.floor((absDifference / 1000) % 60),
        isFinished
      }
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isFinished }
    }
  }

  // 主倒计时计算
  useEffect(() => {
    const calculateTime = () => {
      const result = calculateTimeDifference(targetDate, isCountUp)
      setTimeLeft(result)
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)

    return () => clearInterval(timer)
  }, [targetDate, isCountUp])

  // 从本地存储加载留言
  useEffect(() => {
    const savedMessages = localStorage.getItem('gaokao-messages')
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [])

  // 保存留言到本地存储
  const saveMessages = (newMessages) => {
    localStorage.setItem('gaokao-messages', JSON.stringify(newMessages))
  }

  // 提交留言
  const handleSubmitMessage = (e) => {
    e.preventDefault()
    
    // 基础验证
    if (!newMessage.name.trim() || !newMessage.content.trim()) {
      alert('请填写昵称和留言内容')
      return
    }
    
    if (newMessage.name.length > 20) {
      alert('昵称不能超过20个字符')
      return
    }
    
    if (newMessage.content.length > 200) {
      alert('留言内容不能超过200个字符')
      return
    }

    const message = {
      id: Date.now(),
      name: newMessage.name.trim(),
      content: newMessage.content.trim(),
      isPrivate: newMessage.isPrivate,
      isPinned: false, // 新增置顶字段
      timestamp: new Date().toLocaleString('zh-CN')
    }

    const updatedMessages = [message, ...messages]
    setMessages(updatedMessages)
    saveMessages(updatedMessages)
    setNewMessage({ name: '', content: '', isPrivate: false })
  }

  // 格式化目标日期显示
  const formatTargetDate = () => {
    if (!targetDate) return ''
    const date = new Date(targetDate)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 过滤留言显示
  const getFilteredMessages = () => {
    let filteredMessages
    if (showPrivateMessages && isAuthenticated) {
      filteredMessages = messages // 显示所有留言
    } else {
      filteredMessages = messages.filter(msg => !msg.isPrivate) // 只显示公开留言
    }
    
    // 按置顶状态和时间排序：置顶的在前，然后按时间倒序
    return filteredMessages.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return b.id - a.id // 按ID倒序（新的在前）
    })
  }

  // 渲染HTML内容（简单的HTML支持）
  const renderHTMLContent = (content) => {
    return <div dangerouslySetInnerHTML={{ __html: content }} />
  }

  // 获取背景类名
  const getBackgroundClass = (backgroundColor) => {
    const option = backgroundOptions.find(opt => opt.value === backgroundColor)
    return option ? option.class : ''
  }

  // 渲染倒计时组件
  const renderCountdown = (time, title, endMessage, isMain = false, isFinished = false, backgroundColor = 'default') => {
    const sizeClass = isMain ? 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl' : 'text-sm sm:text-base md:text-lg'
    const containerClass = isMain ? 'countdown-grid grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4' : 'grid grid-cols-4 gap-1 sm:gap-2'
    const backgroundClass = isMain ? '' : getBackgroundClass(backgroundColor)
    
    if (isFinished) {
      return (
        <div className="text-center py-2 sm:py-4">
          <div className={`font-bold ${isMain ? 'text-2xl' : 'text-lg'} ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} animate-pulse`}>
            {endMessage}
          </div>
        </div>
      )
    }

    return (
      <div className={`${containerClass} ${backgroundClass} ${!isMain ? 'p-2 sm:p-3 rounded-lg' : ''}`}>
        <div className="countdown-item text-center">
          <div className={`countdown-number ${sizeClass} font-bold ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          }`}>
            {time.days}
          </div>
          <div className={`countdown-label text-xs ${isMain ? 'sm:text-sm md:text-base' : ''} mt-1 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>天</div>
        </div>
        <div className="countdown-item text-center">
          <div className={`countdown-number ${sizeClass} font-bold ${
            isDarkMode ? 'text-green-400' : 'text-green-600'
          }`}>
            {time.hours}
          </div>
          <div className={`countdown-label text-xs ${isMain ? 'sm:text-sm md:text-base' : ''} mt-1 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>时</div>
        </div>
        <div className="countdown-item text-center">
          <div className={`countdown-number ${sizeClass} font-bold ${
            isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
          }`}>
            {time.minutes}
          </div>
          <div className={`countdown-label text-xs ${isMain ? 'sm:text-sm md:text-base' : ''} mt-1 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>分</div>
        </div>
        <div className="countdown-item text-center">
          <div className={`countdown-number ${sizeClass} font-bold ${
            isDarkMode ? 'text-red-400' : 'text-red-600'
          }`}>
            {time.seconds}
          </div>
          <div className={`countdown-label text-xs ${isMain ? 'sm:text-sm md:text-base' : ''} mt-1 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>秒</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-pink-50'
    }`}>
      {/* 头部标题和设置 */}
      <header className="text-center py-6 sm:py-8 px-4 relative">
        {/* 设置按钮 */}
        <div className="absolute top-4 right-4 flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={showSettingsPanel}
            className={`${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">设置</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className={`${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="hidden sm:inline ml-1">主题</span>
          </Button>
          {isAuthenticated ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className={`${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
            >
              <Unlock className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">退出</span>
            </Button>
          ) : (
            <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
                >
                  <Lock className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">管理</span>
                </Button>
              </DialogTrigger>
              <DialogContent className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                <DialogHeader>
                  <DialogTitle className={`${isDarkMode ? 'text-gray-200' : ''}`}>
                    管理员认证
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    type="password"
                    placeholder="请输入管理密钥"
                    value={authKey}
                    onChange={(e) => setAuthKey(e.target.value)}
                    className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}
                    onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                  />
                  <Button onClick={handleAuth} className="w-full">
                    <Key className="w-4 h-4 mr-2" />
                    验证
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <h1 className={`text-3xl sm:text-4xl md:text-6xl font-bold mb-4 animate-fade-in gradient-text ${
          isDarkMode ? 'text-gray-100' : 'text-gray-800'
        }`}>
          {isCountUp ? 'Beiyao的' : '高考倒计时'}
        </h1>
        <p className={`text-base sm:text-lg md:text-xl animate-fade-in-delay ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          距离高考和杂七杂八的时间还有
        </p>
      </header>

      {/* 设置面板认证对话框 */}
      <Dialog open={showSettingsAuthDialog} onOpenChange={setShowSettingsAuthDialog}>
        <DialogContent className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-200' : ''}`}>
              <Shield className="w-5 h-5" />
              设置面板认证
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              修改设置需要管理员权限，请输入密钥：
            </p>
            <Input
              type="password"
              placeholder="请输入管理密钥"
              value={settingsAuthKey}
              onChange={(e) => setSettingsAuthKey(e.target.value)}
              className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}
              onKeyPress={(e) => e.key === 'Enter' && handleSettingsAuth()}
            />
            <Button onClick={handleSettingsAuth} className="w-full">
              <Key className="w-4 h-4 mr-2" />
              验证并进入设置
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 设置面板 */}
      {showSettings && (
        <section className="max-w-4xl mx-auto px-4 mb-6 sm:mb-8">
          <Card className={`enhanced-card backdrop-blur-sm shadow-xl border-0 ${
            isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80'
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={`flex items-center gap-2 text-lg sm:text-xl ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  <Settings className="w-5 h-5" />
                  设置
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                  className={`${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
                >
                  关闭
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* 主倒计时设置 */}
              <div className="space-y-4 border-b pb-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  主倒计时设置
                </h3>
                
                {/* 目标日期设置 */}
                <div className="space-y-2">
                  <Label className={`flex items-center gap-2 text-sm sm:text-base ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Calendar className="w-4 h-4" />
                    目标日期时间
                  </Label>
                  <Input
                    type="datetime-local"
                    value={targetDate}
                    onChange={(e) => updateTargetDate(e.target.value)}
                    className={`enhanced-input ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''
                    }`}
                  />
                  <p className={`text-xs sm:text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    当前目标：{formatTargetDate()}
                  </p>
                </div>

                {/* 结束消息设置 */}
                <div className="space-y-2">
                  <Label className={`flex items-center gap-2 text-sm sm:text-base ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <MessageCircle className="w-4 h-4" />
                    倒计时结束消息
                  </Label>
                  <Input
                    type="text"
                    value={endMessage}
                    onChange={(e) => updateEndMessage(e.target.value)}
                    placeholder="倒计时结束后显示的文字"
                    className={`enhanced-input ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''
                    }`}
                  />
                </div>

                {/* 计时模式切换 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <Label className={`flex items-center gap-2 text-sm sm:text-base ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {isCountUp ? <Play className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
                    计时模式
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs sm:text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      倒计时
                    </span>
                    <Switch
                      checked={isCountUp}
                      onCheckedChange={toggleCountMode}
                    />
                    <span className={`text-xs sm:text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      正计时
                    </span>
                  </div>
                </div>

                {/* 主题切换 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <Label className={`flex items-center gap-2 text-sm sm:text-base ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    主题模式
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs sm:text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      浅色
                    </span>
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={toggleTheme}
                    />
                    <span className={`text-xs sm:text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      深色
                    </span>
                  </div>
                </div>
              </div>

              {/* 多倒计时管理 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    多倒计时管理
                  </h3>
                  <Dialog open={showAddCountdownDialog} onOpenChange={setShowAddCountdownDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        添加倒计时
                      </Button>
                    </DialogTrigger>
                    <DialogContent className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                      <DialogHeader>
                        <DialogTitle className={`${isDarkMode ? 'text-gray-200' : ''}`}>
                          添加新倒计时
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className={`${isDarkMode ? 'text-gray-300' : ''}`}>标题</Label>
                          <Input
                            value={newCountdown.title}
                            onChange={(e) => setNewCountdown({...newCountdown, title: e.target.value})}
                            placeholder="倒计时标题"
                            className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}
                          />
                        </div>
                        <div>
                          <Label className={`${isDarkMode ? 'text-gray-300' : ''}`}>目标日期时间</Label>
                          <Input
                            type="datetime-local"
                            value={newCountdown.targetDate}
                            onChange={(e) => setNewCountdown({...newCountdown, targetDate: e.target.value})}
                            className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}
                          />
                        </div>
                        <div>
                          <Label className={`${isDarkMode ? 'text-gray-300' : ''}`}>结束消息</Label>
                          <Input
                            value={newCountdown.endMessage}
                            onChange={(e) => setNewCountdown({...newCountdown, endMessage: e.target.value})}
                            placeholder="倒计时结束后显示的文字"
                            className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}
                          />
                        </div>
                        <div>
                          <Label className={`${isDarkMode ? 'text-gray-300' : ''}`}>背景颜色</Label>
                          <Select
                            value={newCountdown.backgroundColor}
                            onValueChange={(value) => setNewCountdown({...newCountdown, backgroundColor: value})}
                          >
                            <SelectTrigger className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}>
                              <SelectValue placeholder="选择背景颜色" />
                            </SelectTrigger>
                            <SelectContent className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}>
                              {backgroundOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value} className={`${isDarkMode ? 'text-gray-200 focus:bg-gray-600' : ''}`}>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded border ${option.class || 'bg-gray-200 dark:bg-gray-600'}`}></div>
                                    {option.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className={`${isDarkMode ? 'text-gray-300' : ''}`}>计时模式</Label>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              倒计时
                            </span>
                            <Switch
                              checked={newCountdown.isCountUp}
                              onCheckedChange={(checked) => setNewCountdown({...newCountdown, isCountUp: checked})}
                            />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              正计时
                            </span>
                          </div>
                        </div>
                        <Button onClick={addCountdown} className="w-full">
                          添加倒计时
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* 倒计时列表 */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {additionalCountdowns.length === 0 ? (
                    <p className={`text-center py-4 text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      还没有添加额外的倒计时
                    </p>
                  ) : (
                    additionalCountdowns.map((countdown, index) => (
                      <div
                        key={countdown.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-move ${
                          isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                        } ${draggedItem === index ? 'opacity-50' : ''}`}
                      >
                        <GripVertical className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <div className={`w-4 h-4 rounded border ${getBackgroundClass(countdown.backgroundColor) || 'bg-gray-200 dark:bg-gray-600'}`}></div>
                        <div className="flex-1">
                          <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {countdown.title}
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date(countdown.targetDate).toLocaleString('zh-CN')} | {countdown.isCountUp ? '正计时' : '倒计时'}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editCountdown(countdown)}
                          className={`p-1 h-auto ${
                            isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                          }`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCountdown(countdown.id)}
                          className={`p-1 h-auto ${
                            isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500'
                          }`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* 编辑倒计时对话框 */}
      <Dialog open={showEditCountdownDialog} onOpenChange={setShowEditCountdownDialog}>
        <DialogContent className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
          <DialogHeader>
            <DialogTitle className={`${isDarkMode ? 'text-gray-200' : ''}`}>
              编辑倒计时
            </DialogTitle>
          </DialogHeader>
          {editingCountdown && (
            <div className="space-y-4">
              <div>
                <Label className={`${isDarkMode ? 'text-gray-300' : ''}`}>标题</Label>
                <Input
                  value={editingCountdown.title}
                  onChange={(e) => setEditingCountdown({...editingCountdown, title: e.target.value})}
                  placeholder="倒计时标题"
                  className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}
                />
              </div>
              <div>
                <Label className={`${isDarkMode ? 'text-gray-300' : ''}`}>目标日期时间</Label>
                <Input
                  type="datetime-local"
                  value={editingCountdown.targetDate}
                  onChange={(e) => setEditingCountdown({...editingCountdown, targetDate: e.target.value})}
                  className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}
                />
              </div>
              <div>
                <Label className={`${isDarkMode ? 'text-gray-300' : ''}`}>结束消息</Label>
                <Input
                  value={editingCountdown.endMessage}
                  onChange={(e) => setEditingCountdown({...editingCountdown, endMessage: e.target.value})}
                  placeholder="倒计时结束后显示的文字"
                  className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}
                />
              </div>
              <div>
                <Label className={`${isDarkMode ? 'text-gray-300' : ''}`}>背景颜色</Label>
                <Select
                  value={editingCountdown.backgroundColor}
                  onValueChange={(value) => setEditingCountdown({...editingCountdown, backgroundColor: value})}
                >
                  <SelectTrigger className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}>
                    <SelectValue placeholder="选择背景颜色" />
                  </SelectTrigger>
                  <SelectContent className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}>
                    {backgroundOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className={`${isDarkMode ? 'text-gray-200 focus:bg-gray-600' : ''}`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded border ${option.class || 'bg-gray-200 dark:bg-gray-600'}`}></div>
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label className={`${isDarkMode ? 'text-gray-300' : ''}`}>计时模式</Label>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    倒计时
                  </span>
                  <Switch
                    checked={editingCountdown.isCountUp}
                    onCheckedChange={(checked) => setEditingCountdown({...editingCountdown, isCountUp: checked})}
                  />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    正计时
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={saveEditedCountdown} className="flex-1">
                  保存修改
                </Button>
                <Button variant="outline" onClick={() => setShowEditCountdownDialog(false)} className="flex-1">
                  取消
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 主倒计时区域 */}
      <section className="max-w-4xl mx-auto px-4 mb-6 sm:mb-8">
        <Card className={`enhanced-card backdrop-blur-sm shadow-xl border-0 ${
          isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80'
        }`}>
          <CardHeader className="text-center pb-4 sm:pb-6">
            <CardTitle className={`flex items-center justify-center gap-2 text-lg sm:text-xl md:text-2xl ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              {isCountUp ? '已经过去' : '距离目标还有'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderCountdown(timeLeft, '', endMessage, true, timeLeft.isFinished)}
          </CardContent>
        </Card>
      </section>

      {/* 多倒计时区域 */}
      {additionalCountdowns.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {additionalCountdowns.map((countdown) => {
              const time = calculateTimeDifference(countdown.targetDate, countdown.isCountUp)
              return (
                <Card key={countdown.id} className={`enhanced-card backdrop-blur-sm shadow-md border-0 ${
                  isDarkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-white/60'
                }`}>
                  <CardHeader className="text-center pb-2 pt-3">
                    <CardTitle className={`text-sm sm:text-base font-medium ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      {countdown.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 pb-3">
                    {renderCountdown(time, countdown.title, countdown.endMessage, false, time.isFinished, countdown.backgroundColor)}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {/* 留言区域 */}
      <section className="max-w-4xl mx-auto px-4 mb-8 sm:mb-12">
        <Card className={`enhanced-card backdrop-blur-sm shadow-xl border-0 ${
          isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80'
        }`}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className={`flex items-center gap-2 text-lg sm:text-xl md:text-2xl ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                对我说什么
              </CardTitle>
              {isAuthenticated && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPrivateMessages(!showPrivateMessages)}
                  className={`${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
                >
                  {showPrivateMessages ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span className="ml-1">{showPrivateMessages ? '隐藏私密' : '显示私密'}</span>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* 留言表单 */}
            <form onSubmit={handleSubmitMessage} className="message-form space-y-4 mb-6 sm:mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Input
                  placeholder="请输入您的昵称"
                  value={newMessage.name}
                  onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })}
                  maxLength={20}
                  className={`enhanced-input lg:col-span-1 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' : ''
                  }`}
                />
                <Textarea
                  placeholder="写下您想对我说的话.."
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                  maxLength={200}
                  className={`enhanced-input lg:col-span-2 min-h-[80px] sm:min-h-[100px] ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' : ''
                  }`}
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="private"
                    checked={newMessage.isPrivate}
                    onCheckedChange={(checked) => setNewMessage({ ...newMessage, isPrivate: checked })}
                  />
                  <Label 
                    htmlFor="private" 
                    className={`text-sm cursor-pointer ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    私密留言（仅管理员可见）
                  </Label>
                </div>
                <Button type="submit" className="send-button w-full sm:w-auto">
                  <Heart className="w-4 h-4 mr-2" />
                  发送祝福
                </Button>
              </div>
            </form>

            {/* 留言展示 */}
            <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto custom-scrollbar">
              {getFilteredMessages().length === 0 ? (
                <p className={`text-center py-6 sm:py-8 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  还没有留言，快来写下第一条留言吧！
                </p>
              ) : (
                getFilteredMessages().map((message) => (
                  <div key={message.id} className={`message-card rounded-lg p-3 sm:p-4 ${
                    isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                  } ${message.isPrivate ? 'border-l-4 border-yellow-500' : ''} ${
                    message.isPinned ? 'border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : ''
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-sm sm:text-base ${
                          isDarkMode ? 'text-blue-400' : 'text-blue-600'
                        }`}>{message.name}</span>
                        {message.isPrivate && (
                          <Lock className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                          }`} />
                        )}
                        {message.isPinned && (
                          <Pin className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            isDarkMode ? 'text-blue-400' : 'text-blue-600'
                          }`} />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>{message.timestamp}</span>
                        {isAuthenticated && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePinMessage(message.id)}
                              className={`p-1 h-auto ${
                                message.isPinned
                                  ? (isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500')
                                  : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-500')
                              }`}
                              title={message.isPinned ? '取消置顶' : '置顶留言'}
                            >
                              {message.isPinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteMessage(message.id)}
                              className={`p-1 h-auto ${
                                isDarkMode ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' : 'text-red-600 hover:text-red-500 hover:bg-red-50'
                              }`}
                              title="删除留言"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <p className={`text-sm sm:text-base ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>{message.content}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 版权信息和介绍链接 */}
      <footer className={`text-center py-6 sm:py-8 px-4 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-4 text-sm sm:text-base">
            <a 
              href="https://beiyaoo.top" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`hover:underline transition-colors ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
              }`}
            >
              <strong>Beiyao</strong> 的网站
            </a>
            <span className="hidden sm:inline">|</span>
            <a 
              href="https://doing.beiyaoo.top" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`hover:underline transition-colors ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
              }`}
            >
              beiyao<em>在干嘛</em>
            </a>
            <span className="hidden sm:inline">|</span>
            <a 
              href="mailto:beiyao.chen@qq.com"
              className={`hover:underline transition-colors ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
              }`}
            >
              联系我们
            </a>
          </div>
          <div className="text-xs sm:text-sm space-y-2">
            {renderHTMLContent('<p></p>')}
            <p>&copy; 助我高考顺利</p>
            <p className="text-xs">）</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

