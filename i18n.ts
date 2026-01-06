
export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    title: '工业AI智能管理平台',
    nav: {
      dashboard: '系统概览',
      ald: 'ALD工艺推荐',
      wet: '湿法知识助手',
      ticket: '工单智能审核',
      warehouse: '研发智能仓储',
      settings: '系统设置'
    },
    header: {
      search: '搜索功能或数据...',
      admin: '管理员',
      role: '超管权限'
    },
    dashboard: {
      aldCount: '工艺推荐总数',
      alerts: '异常告警',
      resolveRate: '工单解决率',
      activity: '系统活跃度',
      vsMonth: '较上月',
      weeklyStats: '工艺执行统计 (每周)',
      efficiencyCurve: '资源利用效率曲线'
    },
    ald: {
      title: 'ALD 工艺智能推荐系统',
      placeholder: '输入目标化学元素 (例如: Ti, Al, Co)...',
      btnSearch: '开始检索',
      searching: '检索中...',
      localStatus: '本地前体库状态',
      localMatch: '已匹配 {n} 种校内采购前体',
      depth: '文献检索深度',
      depthDesc: '实时检索 Google Scholar & 本地数据库',
      weightRule: '权重计算规则',
      weightDesc: '影响因子 / 引用数 / QS等',
      weightTitle: '权重分配说明',
      weightRules: [
        '影响因子（谷歌学术）：权重 4',
        '通讯作者级别：权重 2',
        '单位QS排名：权重 3',
        '引用次数：权重 5',
        '设备型号匹配：权重 1'
      ],
      table: {
        scheme: '推荐方案',
        temp: '反应温度',
        score: '权重分数',
        details: '详情'
      },
      params: '详细工艺参数',
      aiAnalysis: 'AI 推荐思路分析',
      noResult: '暂无检索结果'
    },
    ticket: {
      title: '厂务工单智能审核系统',
      recording: '正在录音...',
      descLabel: '描述故障情况',
      transcribing: '正在转录语音...',
      placeholder: '请详细描述设备故障现象、发生时间、环境变化等...',
      btnSubmit: '提交审核',
      btnSubmitting: '智能审核分析中...',
      coreInfo: '核心信息结构化提取',
      validity: '工单完整性与逻辑校验',
      solutions: '历史相似故障解决方案推荐 (匹配度 ≥85%)',
      apply: '采用此方案'
    },
    warehouse: {
      title: '实验室研发型智能仓储',
      subtitle: '物料安全管控、动态库存预测与全生命周期管理',
      tabs: {
        inventory: '库位与录入',
        safety: '安全与监测',
        maintenance: '备件与生命周期',
        analytics: '成本与能耗'
      },
      btnVoice: '语音录入',
      btnOcr: '单据识别',
      btnAdd: '手动录入',
      safety: {
        gasConc: '气体浓度 (PID/VOC)',
        tempHum: '环境温湿度',
        leakageTitle: 'AI 泄漏风险预警',
        compliance: '人员操作合规检测 (PPE)',
        statusNormal: '监控正常',
        statusAlert: '发现违规/异常'
      },
      maintenance: {
        lifecycle: '备件生命周期预测',
        binding: '绑定设备',
        replaceInterval: '更换间隔分析',
        healthScore: '设备健康度'
      },
      analytics: {
        costTitle: '耗材成本与品牌比对',
        brandEfficiency: '品牌实验成功率比对',
        energyTitle: '仓储能耗动态优化',
        reportBtn: '生成月度分析报告'
      },
      table: {
        info: '物料信息',
        qty: '数量',
        expiry: '有效期健康度',
        action: '操作',
        details: '详情'
      },
      aiTitle: '库存健康度 AI 分析',
      aiDesc: '基于消耗速率 × 交期 + 安全库存规则，自动生成采购清单。',
      btnAi: '运行智能决策',
      aiInsights: 'AI 实时洞察',
      aiPrompt: '点击“运行智能决策”启动研发物料平衡分析',
      healthStats: '物料周转率分布',
      healthLabels: {
        healthy: '充足/健康',
        warning: '临期/低库存',
        critical: '缺货/过期'
      },
      shortage: '关键试剂短缺',
      shortageDesc: '预计 3 天内耗尽。建议启动加急采购。',
      handle: '立即下单'
    }
  },
  en: {
    title: 'Industrial AI Management Platform',
    nav: {
      dashboard: 'Overview',
      ald: 'ALD Recipes',
      wet: 'Wet Process',
      ticket: 'Ticket Audit',
      warehouse: 'Lab Warehouse',
      settings: 'Settings'
    },
    header: {
      search: 'Search features or data...',
      admin: 'Administrator',
      role: 'Super Admin'
    },
    dashboard: {
      aldCount: 'Total Recipes',
      alerts: 'Anomalies',
      resolveRate: 'Resolution Rate',
      activity: 'System Activity',
      vsMonth: 'vs last month',
      weeklyStats: 'Process Execution (Weekly)',
      efficiencyCurve: 'Resource Efficiency Curve'
    },
    ald: {
      title: 'ALD Intelligent Recommendation',
      placeholder: 'Enter chemical element (e.g. Ti, Al, Co)...',
      btnSearch: 'Search',
      searching: 'Searching...',
      localStatus: 'Precursor Inventory',
      localMatch: '{n} local precursors matched',
      depth: 'Search Depth',
      depthDesc: 'Google Scholar & Local DB Real-time',
      weightRule: 'Weighting Rules',
      weightDesc: 'Impact Factor / Citations / QS',
      weightTitle: 'Weight Allocation Details',
      weightRules: [
        'Impact Factor: Weight 4',
        'Corresponding Author Level: Weight 2',
        'QS Ranking: Weight 3',
        'Citations: Weight 5',
        'Tool Matching: Weight 1'
      ],
      table: {
        scheme: 'Recommended Scheme',
        temp: 'Temperature',
        score: 'Score',
        details: 'Details'
      },
      params: 'Process Parameters',
      aiAnalysis: 'AI Recommendation Logic',
      noResult: 'No results found'
    },
    ticket: {
      title: 'Maintenance Ticket AI Audit',
      recording: 'Recording...',
      descLabel: 'Fault Description',
      transcribing: 'Transcribing voice...',
      placeholder: 'Describe fault symptoms, time, environmental changes...',
      btnSubmit: 'Submit Audit',
      btnSubmitting: 'Analyzing...',
      coreInfo: 'Structured Extraction',
      validity: 'Validity & Logic Check',
      solutions: 'Recommended Historical Solutions (Match ≥85%)',
      apply: 'Apply Solution'
    },
    warehouse: {
      title: 'Lab R&D Smart Warehouse',
      subtitle: 'Safety control, dynamic stock prediction & lifecycle management',
      tabs: {
        inventory: 'Inventory & Entry',
        safety: 'Safety & Sensors',
        maintenance: 'Parts & Lifecycle',
        analytics: 'Cost & Energy'
      },
      btnVoice: 'Voice Entry',
      btnOcr: 'OCR Scan',
      btnAdd: 'Manual Add',
      safety: {
        gasConc: 'Gas Conc (PID/VOC)',
        tempHum: 'Temp & Humidity',
        leakageTitle: 'AI Leakage Risk',
        compliance: 'Personnel Compliance (PPE)',
        statusNormal: 'Monitoring Normal',
        statusAlert: 'Violation/Anomaly'
      },
      maintenance: {
        lifecycle: 'Parts Lifecycle Prediction',
        binding: 'Linked Tool',
        replaceInterval: 'Interval Analysis',
        healthScore: 'Tool Health'
      },
      analytics: {
        costTitle: 'Cost & Brand Comparison',
        brandEfficiency: 'Exp. Success Rate by Brand',
        energyTitle: 'Energy Optimization',
        reportBtn: 'Generate Monthly Report'
      },
      table: {
        info: 'Material Info',
        qty: 'Quantity',
        expiry: 'Expiry Health',
        action: 'Action',
        details: 'Details'
      },
      aiTitle: 'Inventory Health AI Analysis',
      aiDesc: 'Auto-procurement based on Consumption × Lead Time + Safety Stock.',
      btnAi: 'Run Intelligent Decision',
      aiInsights: 'AI Real-time Insights',
      aiPrompt: 'Click "Run Intelligent Decision" for balance analysis',
      healthStats: 'Turnover Rate Distribution',
      healthLabels: {
        healthy: 'Healthy/Sufficient',
        warning: 'Expiring/Low Stock',
        critical: 'Out/Expired'
      },
      shortage: 'Critical Reagent Shortage',
      shortageDesc: 'Depletion in 3 days. Suggest urgent procurement.',
      handle: 'Order Now'
    }
  }
};
