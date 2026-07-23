const projects = [
  {
    index: "01",
    title: "第一个作品",
    category: "个人项目 · 即将上线",
    description:
      "这里可以放你的代表作：讲清楚它解决了什么问题、你负责了什么，以及最终取得了怎样的结果。",
    tone: "blue",
  },
  {
    index: "02",
    title: "一次有趣的尝试",
    category: "实验项目 · 持续更新",
    description:
      "也可以收录练习、探索和未完成的想法。好的作品集不只展示答案，也展示你的思考过程。",
    tone: "lime",
  },
  {
    index: "03",
    title: "下一件作品",
    category: "保留位置 · 敬请期待",
    description:
      "未来新增作品时，只需替换标题、简介和链接。这个版式会自然适应更多内容。",
    tone: "coral",
  },
];

const skills = ["创意与策划", "视觉与体验", "内容表达", "持续学习"];

export default function Home() {
  return (
    <main>
      <nav className="nav shell" aria-label="主导航">
        <a className="brand" href="#top" aria-label="返回首页">
          <span className="brand-mark">Y</span>
          <span>YOUR NAME</span>
        </a>
        <div className="nav-links">
          <a href="#about">关于</a>
          <a href="#work">作品</a>
          <a href="#contact">联系</a>
        </div>
      </nav>

      <section className="hero shell" id="top">
        <div className="eyebrow">
          <span className="status-dot" />
          欢迎来到我的个人空间
        </div>
        <h1>
          你好，我是
          <span>你的名字。</span>
        </h1>
        <div className="hero-bottom">
          <p>
            我对好奇的事保持热情，把想法变成作品。
            <br />
            这里记录我的成长、实践与正在发生的一切。
          </p>
          <a className="round-link" href="#work" aria-label="查看我的作品">
            <span>查看作品</span>
            <b aria-hidden="true">↘</b>
          </a>
        </div>
        <div className="hero-stamp" aria-hidden="true">
          <span>BASED IN CHINA</span>
          <strong>✦</strong>
          <span>OPEN TO IDEAS</span>
        </div>
      </section>

      <section className="marquee" aria-label="个人关键词">
        <div>
          <span>保持好奇</span><b>✦</b>
          <span>认真创造</span><b>✦</b>
          <span>不断生长</span><b>✦</b>
          <span>保持好奇</span><b>✦</b>
          <span>认真创造</span>
        </div>
      </section>

      <section className="about shell section" id="about">
        <div className="section-label">
          <span>01</span>
          <p>关于我</p>
        </div>
        <div className="about-content">
          <h2>
            我相信，真正打动人的作品，
            <em>都有清晰的想法与真诚的表达。</em>
          </h2>
          <div className="about-grid">
            <p>
              这里可以写一段你的自我介绍。你是谁、正在做什么、擅长什么，以及你希望遇见怎样的机会。文字不必很长，真实比完美更重要。
            </p>
            <p>
              这套主页为未来的作品集预留了完整空间。你可以逐步加入项目图片、案例详情、社交账号和个人履历，让它陪你一起成长。
            </p>
          </div>
          <div className="skills" aria-label="能力标签">
            {skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="work section" id="work">
        <div className="shell">
          <div className="section-label light">
            <span>02</span>
            <p>精选作品</p>
          </div>
          <div className="work-heading">
            <h2>我的作品集</h2>
            <p>持续更新中 / 2026—未来</p>
          </div>
          <div className="project-list">
            {projects.map((project) => (
              <article className="project" key={project.index}>
                <div className={`project-art ${project.tone}`}>
                  <span>{project.index}</span>
                  <div className="art-orbit" />
                  <b>PROJECT</b>
                </div>
                <div className="project-copy">
                  <p className="project-meta">{project.category}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <span className="project-link">
                    案例待补充 <b aria-hidden="true">↗</b>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact shell section" id="contact">
        <div className="section-label">
          <span>03</span>
          <p>保持联系</p>
        </div>
        <div className="contact-content">
          <p>有一个好想法，或者只是想打个招呼？</p>
          <h2>让我们聊聊。</h2>
          <a className="email-link" href="mailto:hello@example.com">
            hello@example.com <span aria-hidden="true">↗</span>
          </a>
          <div className="socials">
            <a href="#contact">小红书</a>
            <a href="#contact">即刻</a>
            <a href="#contact">GitHub</a>
          </div>
        </div>
      </section>

      <footer className="footer shell">
        <p>© 2026 YOUR NAME</p>
        <p>用好奇心构建 · 在中国</p>
        <a href="#top">回到顶部 ↑</a>
      </footer>
    </main>
  );
}
