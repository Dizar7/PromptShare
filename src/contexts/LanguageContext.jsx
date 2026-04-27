import { createContext, useContext, useState, useEffect } from 'react'

// 언어별 번역 데이터 정의
const translations = {
  ko: {
    // 공통
    new_skill: '새 스킬 작성',
    recent_skills: '최근 스킬',
    recommended: '추천 스킬',
    stats: '부서별 통계',
    settings: '설정',
    language: '언어 설정 (Language)',
    language_desc: '서비스에서 사용할 언어를 선택합니다.',
    notification: '알림 설정',
    notif_desc: '새로운 스킬이 등록되거나 내 스킬에 반응이 오면 알림을 받습니다.',
    loading: '로딩 중...',
    dashboard: '대시보드',
    
    // 홈 화면
    hero_title: '나만의 AI 스킬을 만들고 공유하세요',
    hero_desc: (
      <>
        당신의 노하우를 AI 프롬프트로 변환하고 공유하세요.<br />
        GitHub 연동으로 모든 스킬을 안전하게 관리합니다.
      </>
    ),  
    
    // 스킬 폼
    dept_label: '부서 / 직무',
    dept_placeholder: '부서를 선택하세요',
    title_label: '스킬 제목',
    title_placeholder: '예: "코드 리뷰 자동화 봇"',
    prompt_label: '노하우 / 프롬프트 초안',
    prompt_placeholder: '예: "이 코드 던져주면 무조건 주석 달고 리팩토링하게 만들어줘"',
    submit_btn: 'AI 포맷팅 + GitHub 업로드',
    
    // 스킬 목록
    no_skills: '아직 생성된 스킬이 없습니다',
    no_skills_desc: '새로운 스킬을 만들어보세요!',
    view_grid: '격자로 보기',
    view_list: '목록으로 보기',
    uses: '회 사용',
    open: '열기',
    
    // 헤더
    search_placeholder: '컴포넌트 검색...',
    github: 'GitHub',

    // 추천 스킬 페이지
    rec_desc: '동료들이 가장 많이 사용하고 만족도가 높은 스킬들을 모았습니다.',
    rec_empty_title: '인기 스킬 준비 중',
    rec_empty_desc: '현재 부서별 가장 핫한 스킬들을 실시간으로 수집하고 있습니다.',
    notify_me: '알림 받기',

    // 통계 페이지
    stats_desc: '우리 회사의 부서별 AI 스킬 활용 현황을 한눈에 확인하세요.',
    stats_count: '부서별 스킬 등록수',
    stats_active: '가장 활발한 부서',
    stats_preparing: '그래프 데이터 준비 중...',
    dept_dev: '개발팀',
    dept_product: '기획팀',
    dept_design: '디자인팀',
    dept_marketing: '마케팅팀',

    // 설정 페이지 상세
    settings_desc: '서비스 환경 및 알림 설정을 당신의 스타일에 맞게 관리하세요.',

    // 인증 (Login/Signup)
    welcome_back: '만나서 반가워요.',
    email: '이메일',
    password: '비밀번호',
    login: '로그인',
    logging_in: '로그인 중...',
    no_account: '계정이 없으신가요?',
    signup: '회원가입',
    signing_up: '처리 중...',
    create_account: '시작을 함께해요.',
    name: '이름',
    department: '부서',
    confirm_password: '비밀번호 확인',
    already_have_account: '이미 계정이 있으신가요?',
    name_placeholder: '홍길동',
    go_back: '돌아가기',
    login_success: '로그인 성공',
    login_failed: '이메일 또는 비밀번호가 올바르지 않습니다.',
    server_error: '서버와 통신 중 오류가 발생했습니다.',
    logout_success: '로그아웃 되었습니다.',
    signup_success: '회원가입 완료! 로그인해 주세요.',
    password_mismatch: '비밀번호가 일치하지 않습니다.',
    
    // 마이페이지
    manage_profile_desc: '개인 정보 및 계정 설정을 관리하세요.',
    edit_info: '기본 정보 수정',
    nickname: '닉네임',
    save_changes: '변경사항 저장',
    saving: '저장 중...',
    profile_update_success: '프로필 정보가 수정되었습니다.',
    delete_account_confirm: '정말로 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.',
    delete_account_success: '회원 탈퇴가 완료되었습니다.',
    danger_zone: '회원 탈퇴',
    danger_zone_desc: '회원 탈퇴 시 모든 데이터가 영구적으로 삭제됩니다.',
    withdraw: '회원 탈퇴하기',

    // 내 스킬 & 상세 페이지
    my_skills: '스킬 관리',
    my_skills_desc: '내가 직접 등록하고 관리하는 AI 스킬 목록입니다.',
    no_my_skills: '아직 등록한 스킬이 없습니다.',
    no_my_skills_desc: '새로운 AI 스킬을 만들어 팀원들과 공유해 보세요!',
    skill_detail: '스킬 상세 정보',
    back_to_list: '목록으로 돌아가기',
    view_on_github: 'GitHub에서 보기',
    author_info: '작성자 정보',
    delete_skill: '스킬 삭제',
    delete_skill_confirm: '이 스킬을 정말로 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.',
    delete_skill_success: '스킬이 성공적으로 삭제되었습니다.',
    delete_skill_failed: '스킬 삭제 중 오류가 발생했습니다.',
    
    // File Upload
    upload_skill: '파일 업로드',
    upload_success: '파일이 성공적으로 업로드되었습니다.',
    upload_failed: '파일 업로드 중 오류가 발생했습니다.',
    only_markdown: '마크다운(.md) 파일만 업로드 가능합니다.',
    
    // 추가 단위
    unit_skills: '개 스킬',
    unit_views: '회 조회'
  },
  en: {
    new_skill: 'New Skills',
    recent_skills: 'Recent Skills',
    recommended: 'Recommended',
    stats: 'Department Stats',
    settings: 'Settings',
    language: 'Language Settings',
    language_desc: 'Select your preferred language.',
    notification: 'Notifications',
    notif_desc: 'Receive alerts when new skills are registered or people react to yours.',
    loading: 'Loading...',
    dashboard: 'DASHBOARD',
    
    hero_title: 'Create & Share Your AI Skills',
    hero_desc: 'Transform your know-how into AI prompts and share them. All skills are safely managed through GitHub integration.',
    
    dept_label: 'Department / Role',
    dept_placeholder: 'Select a department',
    title_label: 'Skill Title',
    title_placeholder: 'e.g., "Code Review Automation Bot"',
    prompt_label: 'Know-how / Prompt Draft',
    prompt_placeholder: 'e.g., "Add comments and refactor this code whenever I provide it"',
    submit_btn: 'AI Format + Upload to GitHub',
    
    no_skills: 'No skills created yet',
    no_skills_desc: 'Try creating a new skill!',
    view_grid: 'Grid View',
    view_list: 'List View',
    uses: 'Uses',
    open: 'OPEN',
    
    search_placeholder: 'Search components...',
    github: 'GitHub',

    rec_desc: 'Discover the most popular and highly-rated skills used by your colleagues.',
    rec_empty_title: 'Popular Skills Coming Soon',
    rec_empty_desc: 'We are currently collecting the hottest skills from each department in real-time.',
    notify_me: 'Notify Me',

    stats_desc: 'Check the status of AI skill utilization by department in our company at a glance.',
    stats_count: 'Skills by Department',
    stats_active: 'Most Active Department',
    stats_preparing: 'Graph data preparing...',
    dept_dev: 'Development',
    dept_product: 'Product',
    dept_design: 'Design',
    dept_marketing: 'Marketing',

    settings_desc: 'Manage service environment and notification settings to suit your style.',

    // Auth
    welcome_back: 'Welcome Back!',
    email: 'Email',
    password: 'Password',
    login: 'Login',
    logging_in: 'Logging in...',
    no_account: "Don't have an account?",
    signup: 'Sign Up',
    signing_up: 'Processing...',
    create_account: 'Join PromptShare!',
    name: 'Name',
    department: 'Department',
    confirm_password: 'Confirm Password',
    already_have_account: 'Already have an account?',
    name_placeholder: 'John Doe',
    go_back: 'Go Back',
    login_success: 'Login Successful!',
    login_failed: 'Invalid email or password.',
    server_error: 'Server error occurred.',
    logout_success: 'Logged Out.',
    signup_success: 'Signup Complete! Please login.',
    password_mismatch: 'Passwords do not match.',
    
    // Profile Page
    manage_profile_desc: 'Manage your personal information and account settings.',
    edit_info: 'Edit Basic Info',
    nickname: 'Nickname',
    save_changes: 'Save Changes',
    saving: 'Saving...',
    profile_update_success: 'Profile updated successfully.',
    delete_account_confirm: 'Are you sure you want to withdraw? All data will be deleted.',
    delete_account_success: 'Membership withdrawal completed.',
    danger_zone: 'Danger Zone',
    danger_zone_desc: 'All data will be permanently deleted upon withdrawal.',
    withdraw: 'Withdraw Membership',

    // My Skills & Detail
    my_skills: 'My Skills',
    my_skills_desc: 'Manage the AI skills you have registered.',
    no_my_skills: 'No skills registered yet.',
    no_my_skills_desc: 'Create a new AI skill and share it with your team!',
    skill_detail: 'Skill Details',
    back_to_list: 'Back to List',
    view_on_github: 'View on GitHub',
    author_info: 'Author Info',
    delete_skill: 'Delete Skill',
    delete_skill_confirm: 'Are you sure you want to delete this skill? This cannot be undone.',
    delete_skill_success: 'Skill deleted successfully.',
    delete_skill_failed: 'Failed to delete skill.',

    // File Upload
    upload_skill: 'Upload File',
    upload_success: 'File uploaded successfully.',
    upload_failed: 'Failed to upload file.',
    only_markdown: 'Only Markdown (.md) files are allowed.',

    // Extra Units
    unit_skills: 'Skills',
    unit_views: 'Views'
  },
  zh: {
    new_skill: '创建新技能',
    recent_skills: '最近的技能',
    recommended: '推荐技能',
    stats: '部门统计',
    settings: '设置',
    language: '语言设置',
    language_desc: '选择您喜欢的语言。',
    notification: '通知设置',
    notif_desc: '当有新技能注册或有人对您的技能做出反应时接收通知。',
    loading: '加载中...',
    dashboard: '仪表板',
    
    hero_title: '创建并共享您的 AI 技能',
    hero_desc: '将您的技术诀窍转化为 AI 提示词并共享。通过 GitHub 集成安全管理所有技能。',
    
    dept_label: '部门 / 职位',
    dept_placeholder: '选择部门',
    title_label: '技能标题',
    title_placeholder: '例如：“代码审查自动化机器人”',
    prompt_label: '知识 / 提示词草案',
    prompt_placeholder: '例如：“每当我提供这段代码时，添加注释并进行重构”',
    submit_btn: 'AI 格式化 + 上传至 GitHub',
    
    no_skills: '尚未创建技能',
    no_skills_desc: '尝试创建一个新技能！',
    view_grid: '网格视图',
    view_list: '列表视图',
    uses: '次使用',
    open: '打开',
    
    search_placeholder: '搜索组件...',
    github: 'GitHub',

    rec_desc: '收集了同事们最常用且满意度最高的技能。',
    rec_empty_title: '热门技能准备中',
    rec_empty_desc: '我们正在实时收集各部门最热门的技能。',
    notify_me: '通知我',

    stats_desc: '一眼查看公司各部门 AI 技能的使用情况。',
    stats_count: '各部门技能注册数',
    stats_active: '最活跃的部门',
    stats_preparing: '图表数据准备中...',
    dept_dev: '开发团队',
    dept_product: '策划团队',
    dept_design: '设计团队',
    dept_marketing: '营销团队',

    settings_desc: '根据您的风格管理服务环境和通知设置。',

    // Auth
    welcome_back: '欢迎回来！',
    email: '电子邮件',
    password: '密码',
    login: '登录',
    logging_in: '登录中...',
    no_account: '还没有账号？',
    signup: '注册',
    signing_up: '处理中...',
    create_account: '加入 PromptShare！',
    name: '姓名',
    department: '部门',
    confirm_password: '确认密码',
    already_have_account: '已有账号？',
    name_placeholder: '张三',
    go_back: '返回',
    login_success: '登录成功！',
    login_failed: '电子邮件或密码错误。',
    server_error: '服务器发生错误。',
    logout_success: '已登出。',
    signup_success: '注册成功！请登录。',
    password_mismatch: '密码不匹配。',

    // Profile Page
    manage_profile_desc: '管理您的个人信息和账户设置。',
    edit_info: '编辑基本信息',
    nickname: '昵称',
    save_changes: '保存更改',
    saving: '保存中...',
    profile_update_success: '个人资料已更新。',
    delete_account_confirm: '您确定要注销吗？所有数据将被删除。',
    delete_account_success: '注销完成。',
    danger_zone: '危险区域',
    danger_zone_desc: '注销后所有数据将永久删除。',
    withdraw: '注销账户',

    // My Skills & Detail
    my_skills: '技能管理',
    my_skills_desc: '管理您注册的 AI 技能。',
    no_my_skills: '尚未注册技能。',
    no_my_skills_desc: '创建新的 AI 技能并与团队共享！',
    skill_detail: '技能详情',
    back_to_list: '返回列表',
    view_on_github: '在 GitHub 上查看',
    author_info: '作者信息',
    delete_skill: '删除技能',
    delete_skill_confirm: '您确定要删除此技能吗？此操作无法撤销。',
    delete_skill_success: '技能删除成功。',
    delete_skill_failed: '删除技能失败。',

    // File Upload
    upload_skill: '上传文件',
    upload_success: '文件上传成功。',
    upload_failed: '文件上传失败。',
    only_markdown: '仅支持 Markdown (.md) 文件。',

    // Extra Units
    unit_skills: '个技能',
    unit_views: '次查看'
  },
  ja: {
    new_skill: '新スキルの作成',
    recent_skills: '最近のスキル',
    recommended: 'おすすめのスキル',
    stats: '部署別統計',
    settings: '設定',
    language: '言語設定',
    language_desc: '使用する言語を選択します.',
    notification: '通知設定',
    notif_desc: '新しいスキルが登録されたり,自分のスキルに反応があった時に通知を受け取ります.',
    loading: '読み込み中...',
    dashboard: 'ダッシュボード',
    
    hero_title: 'AIスキルを作成して共有する',
    hero_desc: 'あなたのノウハウをAIプロンプトに変換して共有しましょう. すべてのスキルはGitHub連携を通じて安全に管理されます.',
    
    dept_label: '部署 / 職務',
    dept_placeholder: '部署を選択してください',
    title_label: 'スキルのタイトル',
    title_placeholder: '例：「コードレビュー自動化ボット」',
    prompt_label: 'ノウハウ / プロンプトの下書き',
    prompt_placeholder: '例：「このコードを渡したら必ずコメントを追加してリファクタリングするようにして」',
    submit_btn: 'AIフォーマット + GitHubにアップロード',
    
    no_skills: 'まだ作成されたスキルはありません',
    no_skills_desc: '新しいスキルを作成してみてください！',
    view_grid: 'グリッド表示',
    view_list: 'リスト表示',
    uses: '回使用',
    open: '開く',
    
    search_placeholder: 'コンポーネントを検索...',
    github: 'GitHub',

    rec_desc: '同僚たちが最もよく使用し,満足度の高いスキルを集めました.',
    rec_empty_title: '人気スキル準備中',
    rec_empty_desc: '現在,部署別に最もホットなスキルをリアルタイムで収集しています.',
    notify_me: '通知を受け取る',

    stats_desc: 'わが社の部署別AIスキルの活用状況を一目で確認してください.',
    stats_count: '部署別スキルの登録数',
    stats_active: '最も活発な部署',
    stats_preparing: 'グラフデータを準備中...',
    dept_dev: '開発チーム',
    dept_product: '企画チーム',
    dept_design: 'デザインチーム',
    dept_marketing: 'マーケティングチーム',

    settings_desc: 'サービス環境や通知設定を自分のスタイルに合わせて管理します.',

    // Auth
    welcome_back: 'おかえりなさい！',
    email: 'メールアドレス',
    password: 'パスワード',
    login: 'ログイン',
    logging_in: 'ログイン中...',
    no_account: 'アカウントをお持ちではありませんか？',
    signup: '新規登録',
    signing_up: '処理中...',
    create_account: 'PromptShareに参加しましょう！',
    name: 'お名前',
    department: '部署',
    confirm_password: 'パスワードの確認',
    already_have_account: 'すでにアカウントをお持ちですか？',
    name_placeholder: '山田太郎',
    go_back: '戻る',
    login_success: 'ログインに成功しました！',
    login_failed: 'メールアドレスまたはパスワードが正しくありません。',
    server_error: 'サーバーエラーが発生しました。',
    logout_success: 'ログアウトしました。',
    signup_success: '会員登録が完了しました！ログインしてください.',
    password_mismatch: 'パスワードが一致しません。',

    // Profile Page
    manage_profile_desc: '個人情報およびアカウント設定を管理します.',
    edit_info: '基本情報の編集',
    nickname: 'ニックネーム',
    save_changes: '変更内容を保存',
    saving: '保存中...',
    profile_update_success: 'プロフィールが更新されました.',
    delete_account_confirm: '本当に退会しますか？すべてのデータが削除されます.',
    delete_account_success: '退会が完了しました.',
    danger_zone: '危険ゾーン',
    danger_zone_desc: '退会するとすべてのデータが永久に削除されます.',
    withdraw: '退会する',

    // My Skills & Detail
    my_skills: 'スキル管理',
    my_skills_desc: '登録した AI スキルを管理します.',
    no_my_skills: 'まだスキルが登録されていません.',
    no_my_skills_desc: '新しい AI スキルを作成してチームと共有しましょう！',
    skill_detail: 'スキル詳細',
    back_to_list: 'リストに戻る',
    view_on_github: 'GitHubで表示',
    author_info: '作成者情報',
    delete_skill: 'スキル削除',
    delete_skill_confirm: 'このスキルを本当に削除しますか？削除後は復旧できません.',
    delete_skill_success: 'スキルが正常に削除されました.',
    delete_skill_failed: 'スキルの削除に失敗しました.',

    // File Upload
    upload_skill: 'ファイルをアップロード',
    upload_success: 'ファイルが正常にアップロードされました.',
    upload_failed: 'ファイルのアップ로드に失敗しました.',
    only_markdown: 'マークダウン(.md)ファイルのみアップロード可能です.',

    // Extra Units
    unit_skills: '個のスキル',
    unit_views: '回の表示'
  }
}

export const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const getInitialLang = () => {
    try {
      const saved = localStorage.getItem('ps_lang')
      return (saved && translations[saved]) ? saved : 'ko'
    } catch {
      return 'ko'
    }
  }

  const [lang, setLang] = useState(getInitialLang())

  useEffect(() => {
    localStorage.setItem('ps_lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const t = (key) => {
    if (!translations[lang]) return translations['ko'][key] || key
    return translations[lang][key] || key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    return { lang: 'ko', setLang: () => {}, t: (k) => k }
  }
  return context
}
