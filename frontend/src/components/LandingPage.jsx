import React from 'react';
import { Link } from 'react-router-dom';

// SVG Icons
const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M7 8l-4 4l4 4"></path>
    <path d="M17 8l4 4l-4 4"></path>
    <path d="M14 4l-4 16"></path>
  </svg>
);

const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8"></path>
    <path d="M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8"></path>
    <path d="M17.5 16a3.5 3.5 0 0 0 0 -7h-.5"></path>
    <path d="M19 9.3v-2.8a3.5 3.5 0 0 0 -7 0"></path>
    <path d="M6.5 16a3.5 3.5 0 0 1 0 -7h.5"></path>
    <path d="M5 9.3v-2.8a3.5 3.5 0 0 1 7 0v10"></path>
  </svg>
);

const TeamIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
    <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z"></path>
    <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path>
    <path d="M8 11v-4a4 4 0 1 1 8 0v4"></path>
  </svg>
);

const CodeEditorComponent = () => {
  return (
    <div className="code-editor-wrapper">
      <div className="code-editor-glow"></div>
      <div className="code-editor-sphere"></div>
      <div className="code-editor">
        <div className="code-editor-header">
          <div className="code-editor-dots">
            <div className="code-editor-dot red"></div>
            <div className="code-editor-dot yellow"></div>
            <div className="code-editor-dot green"></div>
          </div>
          <div className="code-editor-title">binary_search.cpp</div>
          <div></div>
        </div>
        <div className="code-editor-tabs">
          <div className="code-editor-tab active">C++</div>
          <div className="code-editor-tab">Python</div>
          <div className="code-editor-tab">Java</div>
        </div>
        <div className="code-editor-content">
          <pre>
            <div className="code-line">
              <span className="code-line-number">1</span>
              <span className="code-line-content"><span className="token-keyword">#include</span> <span className="token-string">&lt;vector&gt;</span></span>
            </div>
            <div className="code-line">
              <span className="code-line-number">2</span>
              <span className="code-line-content"><span className="token-keyword">#include</span> <span className="token-string">&lt;iostream&gt;</span></span>
            </div>
            <div className="code-line">
              <span className="code-line-number">3</span>
              <span className="code-line-content"></span>
            </div>
            <div className="code-line">
              <span className="code-line-number">4</span>
              <span className="code-line-content"><span className="token-keyword">int</span> <span className="token-function">binarySearch</span>(<span className="token-keyword">const</span> <span className="token-variable">std::vector</span><span className="token-punctuation">&lt;</span><span className="token-keyword">int</span><span className="token-punctuation">&gt;</span><span className="token-punctuation">&</span> <span className="token-variable">nums</span>, <span className="token-keyword">int</span> <span className="token-variable">target</span>) {'{'}</span>
            </div>
            <div className="code-line">
              <span className="code-line-number">5</span>
              <span className="code-line-content">    <span className="token-keyword">int</span> <span className="token-variable">left</span> = <span className="token-number">0</span>;</span>
            </div>
            <div className="code-line">
              <span className="code-line-number">6</span>
              <span className="code-line-content">    <span className="token-keyword">int</span> <span className="token-variable">right</span> = <span className="token-variable">nums</span>.<span className="token-function">size</span>() - <span className="token-number">1</span>;</span>
            </div>
            <div className="code-line">
              <span className="code-line-number">7</span>
              <span className="code-line-content"></span>
            </div>
            <div className="code-line">
              <span className="code-line-number">8</span>
              <span className="code-line-content">    <span className="token-keyword">while</span> (<span className="token-variable">left</span> {'<='} <span className="token-variable">right</span>) {'{'}</span>
            </div>
            <div className="code-line">
              <span className="code-line-number">9</span>
              <span className="code-line-content">        <span className="token-keyword">int</span> <span className="token-variable">mid</span> = <span className="token-variable">left</span> + (<span className="token-variable">right</span> - <span className="token-variable">left</span>) / <span className="token-number">2</span>;</span>
            </div>
            <div className="code-line">
              <span className="code-line-number">10</span>
              <span className="code-line-content"></span>
            </div>
            <div className="code-line">
              <span className="code-line-number">11</span>
              <span className="code-line-content">        <span className="token-keyword">if</span> (<span className="token-variable">nums</span>[<span className="token-variable">mid</span>] {'=='} <span className="token-variable">target</span>) {'{'}</span>
            </div>
            <div className="code-line">
              <span className="code-line-number">12</span>
              <span className="code-line-content">            <span className="token-keyword">return</span> <span className="token-variable">mid</span>;</span>
            </div>
            <div className="code-line">
              <span className="code-line-number">13</span>
              <span className="code-line-content">        {'}'} <span className="token-keyword">else if</span> (<span className="token-variable">nums</span>[<span className="token-variable">mid</span>] {'<'} <span className="token-variable">target</span>) {'{'}</span>
            </div>
            <div className="code-line">
              <span className="code-line-number">14</span>
              <span className="code-line-content">            <span className="token-variable">left</span> = <span className="token-variable">mid</span> + <span className="token-number">1</span>;</span>
            </div>
            <div className="code-line">
              <span className="code-line-number">15</span>
              <span className="code-line-content">        {'}'} <span className="token-keyword">else</span> {'{'}</span>
            </div>
            <div className="code-line">
              <span className="code-line-number">16</span>
              <span className="code-line-content">            <span className="token-variable">right</span> = <span className="token-variable">mid</span> - <span className="token-number">1</span>;</span>
            </div>
            <div className="code-line">
              <span className="code-line-number">17</span>
              <span className="code-line-content">        {'}'}</span>
            </div>
            <div className="code-line">
              <span className="code-line-number">18</span>
              <span className="code-line-content">    {'}'}</span>
            </div>
            <div className="code-line">
              <span className="code-line-number">19</span>
              <span className="code-line-content"></span>
            </div>
            <div className="code-line">
              <span className="code-line-number">20</span>
              <span className="code-line-content">    <span className="token-keyword">return</span> -<span className="token-number">1</span>; <span className="token-comment">// Target not found</span></span>
            </div>
            <div className="code-line">
              <span className="code-line-number">21</span>
              <span className="code-line-content">{'}'}</span>
            </div>
          </pre>
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  return (
    <div className="landing-page">

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-tagline">The Ultimate Coding Platform</div>
            <h1 className="hero-title">
              Code <span className="highlight">Here.</span> Code <span className="highlight">Now.</span>
            </h1>
            <p className="hero-subtitle">
              Master algorithms, ace technical interviews, and advance your coding skills with our comprehensive platform designed for developers of all levels.
            </p>
            <div className="hero-buttons">
              <Link to="/problems" className="btn btn-primary btn-lg">Start Coding</Link>
              <Link to="/problems" className="btn btn-outline-purple">Explore Problems</Link>
            </div>
          </div>
          <div className="hero-image">
            <CodeEditorComponent />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features section">
        <div className="container-narrow">
          <div className="features-header">
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-subtitle">
              Our platform provides the essential tools to enhance your coding skills
            </p>
          </div>
        </div>
        <div className="container">
          <div className="features-grid grid-3">
            <div className="feature-card card card-glass">
              <div className="feature-icon glow-purple">
                <CodeIcon />
              </div>
              <h3 className="feature-title">Curated Problem Set</h3>
              <p>
                Practice with our carefully selected coding challenges across various difficulty levels to build your algorithmic skills.
              </p>
            </div>

            <div className="feature-card card card-glass">
              <div className="feature-icon glow-purple">
                <BrainIcon />
              </div>
              <h3 className="feature-title">Interactive Code Editor</h3>
              <p>
                Write, run, and test your code directly in the browser with our powerful editor featuring syntax highlighting and multiple language support.
              </p>
            </div>

            <div className="feature-card card card-glass">
              <div className="feature-icon glow-purple">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z"></path>
                  <path d="M19 16h-12a2 2 0 0 0 -2 2"></path>
                  <path d="M9 8h6"></path>
                </svg>
              </div>
              <h3 className="feature-title">Daily Challenges</h3>
              <p>
                Build a consistent coding habit with our daily challenges and track your progress with our streak system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples Section */}
      <section className="code-examples section">
        <div className="container">
          <div className="code-examples-content">
            <h2 className="code-examples-title">Online IDE for All Languages</h2>
            <p className="code-examples-description">
              Our powerful online IDE supports 20+ programming languages with syntax highlighting,
              auto-completion, and real-time error checking.
            </p>
            <ul className="code-examples-list">
              <li>Write, run, and debug code in your browser</li>
              <li>Save your solutions and track your progress</li>
              <li>Compare your solutions with others</li>
              <li>Access your code from anywhere</li>
            </ul>
            <Link to="/problems" className="btn btn-primary">Try it Now</Link>
          </div>
          <div className="code-examples-image">
            <div className="code-editor">
              <div className="code-editor-header">
                <div className="code-editor-dots">
                  <div className="code-editor-dot red"></div>
                  <div className="code-editor-dot yellow"></div>
                  <div className="code-editor-dot green"></div>
                </div>
                <div className="code-editor-title">two_sum.cpp</div>
                <div></div>
              </div>
              <div className="code-editor-content">
                <pre>
                  <div className="code-line">
                    <span className="code-line-number">1</span>
                    <span className="code-line-content"><span className="token-keyword">#include</span> <span className="token-string">&lt;vector&gt;</span></span>
                  </div>
                  <div className="code-line">
                    <span className="code-line-number">2</span>
                    <span className="code-line-content"><span className="token-keyword">#include</span> <span className="token-string">&lt;unordered_map&gt;</span></span>
                  </div>
                  <div className="code-line">
                    <span className="code-line-number">3</span>
                    <span className="code-line-content"></span>
                  </div>
                  <div className="code-line">
                    <span className="code-line-number">4</span>
                    <span className="code-line-content"><span className="token-keyword">class</span> <span className="token-function">Solution</span> {'{'}</span>
                  </div>
                  <div className="code-line">
                    <span className="code-line-number">5</span>
                    <span className="code-line-content"><span className="token-keyword">public</span>:</span>
                  </div>
                  <div className="code-line">
                    <span className="code-line-number">6</span>
                    <span className="code-line-content">    <span className="token-variable">std::vector</span><span className="token-punctuation">&lt;</span><span className="token-keyword">int</span><span className="token-punctuation">&gt;</span> <span className="token-function">twoSum</span>(<span className="token-keyword">const</span> <span className="token-variable">std::vector</span><span className="token-punctuation">&lt;</span><span className="token-keyword">int</span><span className="token-punctuation">&gt;</span><span className="token-punctuation">&</span> <span className="token-variable">nums</span>, <span className="token-keyword">int</span> <span className="token-variable">target</span>) {'{'}</span>
                  </div>
                  <div className="code-line">
                    <span className="code-line-number">7</span>
                    <span className="code-line-content">        <span className="token-comment">// Create a hash map</span></span>
                  </div>
                  <div className="code-line">
                    <span className="code-line-number">8</span>
                    <span className="code-line-content">        <span className="token-variable">std::unordered_map</span><span className="token-punctuation">&lt;</span><span className="token-keyword">int</span>, <span className="token-keyword">int</span><span className="token-punctuation">&gt;</span> <span className="token-variable">hash_map</span>;</span>
                  </div>
                  <div className="code-line">
                    <span className="code-line-number">9</span>
                    <span className="code-line-content"></span>
                  </div>
                  <div className="code-line">
                    <span className="code-line-number">10</span>
                    <span className="code-line-content">        <span className="token-keyword">for</span> (<span className="token-keyword">int</span> <span className="token-variable">i</span> = <span className="token-number">0</span>; <span className="token-variable">i</span> {'<'} <span className="token-variable">nums</span>.<span className="token-function">size</span>(); ++<span className="token-variable">i</span>) {'{'}</span>
                  </div>
                  <div className="code-line">
                    <span className="code-line-number">11</span>
                    <span className="code-line-content">            <span className="token-keyword">int</span> <span className="token-variable">complement</span> = <span className="token-variable">target</span> - <span className="token-variable">nums</span>[<span className="token-variable">i</span>];</span>
                  </div>
                  <div className="code-line">
                    <span className="code-line-number">12</span>
                    <span className="code-line-content"></span>
                  </div>
                  <div className="code-line">
                    <span className="code-line-number">13</span>
                    <span className="code-line-content">            <span className="token-keyword">if</span> (<span className="token-variable">hash_map</span>.<span className="token-function">find</span>(<span className="token-variable">complement</span>) {'!='} <span className="token-variable">hash_map</span>.<span className="token-function">end</span>()) {'{'}</span>
                  </div>
                  <div className="code-line">
                    <span className="code-line-number">14</span>
                    <span className="code-line-content">                <span className="token-keyword">return</span> {<span className="token-variable">hash_map</span>[<span className="token-variable">complement</span>], <span className="token-variable">i</span>};</span>
                  </div>
                  <div className="code-line">
                    <span className="code-line-number">15</span>
                    <span className="code-line-content">            {'}'}</span>
                  </div>
                  <div className="code-line">
                    <span className="code-line-number">16</span>
                    <span className="code-line-content"></span>
                  </div>
                  <div className="code-line">
                    <span className="code-line-number">17</span>
                    <span className="code-line-content">            <span className="token-variable">hash_map</span>[<span className="token-variable">nums</span>[<span className="token-variable">i</span>]] = <span className="token-variable">i</span>;</span>
                  </div>
                  <div className="code-line">
                    <span className="code-line-number">18</span>
                    <span className="code-line-content">        {'}'}</span>
                  </div>
                  <div className="code-line">
                    <span className="code-line-number">19</span>
                    <span className="code-line-content"></span>
                  </div>
                  <div className="code-line">
                    <span className="code-line-number">20</span>
                    <span className="code-line-content">        <span className="token-keyword">return</span> {}; <span className="token-comment">// No solution found</span></span>
                  </div>
                  <div className="code-line">
                    <span className="code-line-number">21</span>
                    <span className="code-line-content">    {'}'}</span>
                  </div>
                  <div className="code-line">
                    <span className="code-line-number">22</span>
                    <span className="code-line-content">{'}'};</span>
                  </div>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="gradient-purple">2M+</h3>
              <p>Active Users</p>
            </div>
            <div className="stat-card">
              <h3 className="gradient-green">20+</h3>
              <p>Programming Languages</p>
            </div>
            <div className="stat-card">
              <h3 className="gradient-pink">5K+</h3>
              <p>Daily Submissions</p>
            </div>
            <div className="stat-card">
              <h3 className="gradient-mixed">98%</h3>
              <p>Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials section">
        <div className="container-narrow">
          <div className="testimonials-header">
            <h2 className="section-title">Hear From Other CodeMaster Users</h2>
            <p className="section-subtitle">
              Join thousands of developers who have improved their coding skills with our platform
            </p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-content">
                "CodeMaster helped me prepare for my technical interviews and land my dream job at Google. The problems are challenging and the solutions are insightful."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">JD</div>
                <div className="testimonial-info">
                  <h4>John Doe</h4>
                  <p>Software Engineer at Google</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-content">
                "I've been using CodeMaster for 6 months and my problem-solving skills have improved dramatically. The community is supportive and the platform is intuitive."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">AS</div>
                <div className="testimonial-info">
                  <h4>Alice Smith</h4>
                  <p>CS Student at MIT</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-content">
                "As a self-taught developer, CodeMaster has been invaluable in helping me understand algorithms and data structures. The explanations are clear and concise."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">RJ</div>
                <div className="testimonial-info">
                  <h4>Robert Johnson</h4>
                  <p>Full Stack Developer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
