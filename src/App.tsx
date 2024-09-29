import logo from "./logo.svg";
import "./App.css";

function App({ isExtension }: { isExtension: boolean }) {
  return (
    <div className="App">
      {isExtension && (
        <img
          src={chrome.runtime.getURL(logo)}
          className="App-logo"
          alt="logo"
        />
      )}
      {!isExtension && (
        <div>
          <i>
            <u>Not an extension</u>
          </i>
        </div>
      )}
      <header>
        <nav>
          <a href="#styles">Styles</a>
          <a href="#classes">Classes</a>
          <a href="#ideas">Style ideas</a>
        </nav>
        <h1>silicon</h1>
        <code>1.2.9</code>
        <h2>13kb classless CSS framework</h2>
        <p>
          <a href="https://github.com/tygzy/silicon" target="_blank">
            Github
          </a>{" "}
          /
          <a href="/silicon.min.css" target="_blank">
            Download
          </a>{" "}
          -<span>Made by</span>{" "}
          <a
            href="https://tyler.contact/trace?site=silicon-css.com"
            target="_blank"
          >
            Tyler
          </a>
        </p>
        <p>
          CSS without the requirement for classes. There <i>are</i> classes in
          silicon, but you could use silicon purely with no classes, just tags
          such as <code>&lt;table&gt;</code>. Fonts are also included in the CSS
          file, so you don't need to link any.
        </p>
      </header>
      <section id="vp-widths">
        <p>
          Silicon also has a light and dark mode that switches with the clients
          operating systems preference.
        </p>
        <p className="card">
          <span className="notice">important information</span>
          There are <u>5 page layouts</u>,{" "}
          <code>&lt;div class='width-xs'&gt;</code>,{" "}
          <code>&lt;div class='width-s'&gt;</code>,{" "}
          <code>&lt;div class='width-m'&gt;</code>,{" "}
          <code>&lt;div class='width-l'&gt;</code>, and{" "}
          <code>&lt;div class='width-xl'&gt;</code>
          they each take up 20%, 30%, 50%, 80%, and 100% of the screen
          respectively on at least
          <code>1920x1080</code> and slightly more on smaller displays, by
          default the <code>&lt;body&gt;</code> will use 30% of the screen,
          these classes will up a portion of the actual screen/viewport. it
          should be noted that all 3 of these viewport classes use 90% of the
          screen on mobiles.
        </p>
      </section>
      <h2 id="styles">Forms</h2>
      <main>
        <form action="/">
          <input type="text" placeholder="Text input" />
          <textarea
            placeholder="Textarea"
            className="ve-resize"
            defaultValue={""}
          />
          <select>
            <option disabled="" selected="">
              Select
            </option>
            <option>Option</option>
          </select>
          <div>
            <label htmlFor="input">Label</label>
            <input type="text" id="input" placeholder="Input with label" />
          </div>
          <div>
            <label htmlFor="input_disabled">Disabled input</label>
            <input
              type="text"
              id="input_disabled"
              placeholder="Disabled input"
              disabled=""
            />
          </div>
          <div>
            <label htmlFor="radio">Radio</label>
            <input type="radio" id="radio" name="radio" defaultValue="radio" />
            <label htmlFor="radio_2">Radio 2</label>
            <input
              type="radio"
              id="radio_2"
              name="radio"
              defaultValue="radio_2"
            />
          </div>
          <div>
            <label htmlFor="checkbox">Checkbox</label>
            <input type="checkbox" id="checkbox" />
          </div>
          <div>
            <label htmlFor="range_input">Range input</label>
            <input type="range" id="range_input" />
          </div>
          <div>
            <label htmlFor="color_input">Color input</label>
            <input type="color" defaultValue="#2c62af" id="color_input" />
          </div>
          <div>
            <label htmlFor="file_input">File input</label>
            <input type="file" id="file_input" />
          </div>
          <input type="submit" defaultValue="Submit input" />
        </form>
        <h4>Buttons</h4>
        <p>
          <button type="button">Button</button>
          <button disabled="">Disabled</button>
          <button type="reset">Reset</button>
        </p>
        <p>
          <button type="button" className="big">
            Big button
          </button>
        </p>
        <h2>Table</h2>
        <table>
          <caption>Caption (Standard table style)</caption>
          <thead>
            <tr>
              <th>th1</th>
              <th>th2</th>
              <th>th3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>td1</td>
              <td>td2</td>
              <td>td3</td>
            </tr>
            <tr>
              <td>td1</td>
              <td>td2</td>
              <td>td3</td>
            </tr>
            <tr>
              <td>td1</td>
              <td>td2</td>
              <td>td3</td>
            </tr>
          </tbody>
        </table>
        <p>
          <code>&lt;table class='alternate'&gt;</code>
        </p>
        <table className="alternate">
          <caption>Caption (Alternate table style)</caption>
          <thead>
            <tr>
              <th>th1</th>
              <th>th2</th>
              <th>th3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>td1</td>
              <td>td2</td>
              <td>td3</td>
            </tr>
            <tr>
              <td>td1</td>
              <td>td2</td>
              <td>td3</td>
            </tr>
            <tr>
              <td>td1</td>
              <td>td2</td>
              <td>td3</td>
            </tr>
          </tbody>
        </table>
        <h1>Header 1 </h1>
        <h2>Header 2</h2>
        <h3>Header 3</h3>
        <h4>Header 4</h4>
        <h5>Header 5</h5>
        <h6>Header 6</h6>
        <h2>Inline tags</h2>
        <h4>Keyboard</h4>
        <p>
          <kbd>CTRL + C</kbd> in case you want to show a keyboard shortcut
        </p>
        <h4>Code</h4>
        <p>
          <code>print('hello world')</code> you might want to embed a snippet of
          code. You can also use <code>&lt;code&gt;</code> inside a{" "}
          <code>&lt;pre&gt;</code> to get a code snippet spanning multiple
          lines.
        </p>
        <pre>
          <code>Example here</code>
        </pre>
        <samp>Sample tag here</samp>
        <p>
          Here is a <var>var</var> tag.
        </p>
        <h2>Text highlighting</h2>
        <p>
          Here is an <ins>ins</ins> tag, here is a <del>del</del> tag, and here
          is a <mark>mark</mark> tag
        </p>
        <h2>Lists</h2>
        <h4>Unordered list</h4>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
          <li>List item 3</li>
          <li>List item 4</li>
          <ul>
            <li>Embedded list item 1</li>
            <li>Embedded list item 2</li>
            <li>Embedded list item 3</li>
          </ul>
        </ul>
        <h4>Ordered list</h4>
        <ol className="no-align">
          <li>List item 1</li>
          <li>List item 2</li>
          <li>List item 3</li>
          <li>List item 4</li>
          <ol>
            <li>Embedded list item 1</li>
            <li>Embedded list item 2</li>
            <li>Embedded list item 3</li>
          </ol>
        </ol>
        <h2>Blockquote</h2>
        <blockquote>
          This is a blockquote
          <footer>Author name, Publication</footer>
        </blockquote>
        <h2>Details</h2>
        <details>
          <summary>Details summary</summary>
          <p>Details content</p>
        </details>
        <h2>Aside</h2>
        <aside>
          <p>Some aside text</p>
        </aside>
      </main>
      <article>
        <h2 id="classes">Classes</h2>
        <p className="card">
          These classes are not required in any way and are completely optional
          to use.
        </p>
        <br />
        <div>
          <p>
            <code>&lt;* class='card'&gt;</code> a card with borders, could be
            used to separate content from something else.
          </p>
          <p>
            <code>&lt;* class='left / center / right'&gt;</code> aligns any text
            to the left / center / right.
          </p>
          <p>
            <code>
              &lt;* class='no-resize / all-resize / ho-resize / ve-resize'&gt;
            </code>{" "}
            allows or disallows a textarea to be resized in specified
            directions.
          </p>
          <p>
            <code>&lt;input / textarea / select class='small'&gt;</code> gives
            less padding on these elements to make them smaller.
          </p>
          <p>
            <code>&lt;button class='big'&gt;</code> gives more padding on the
            button to make it the same size as inputs.
          </p>
          <p>
            <code>&lt;table class='alternate'&gt;</code> uses the alternate
            table style (doesn't change anything with the layout).
          </p>
          <p>
            <code>&lt;* class='desktop-only'&gt;</code> only visible on desktop.
          </p>
          <p>
            <code>&lt;* class='mobile-only'&gt;</code> only visible on mobile.
          </p>
          <h3>Notice cards</h3>
          <ul>
            <li>
              <code>&lt;* class='notice'&gt;</code> creates a focal point with
              uppercase text and center alignment.
            </li>
            <ul>
              <li>
                <code>&lt;* class='notice warning'&gt;</code> creates a
                danger/red card with otherwise same styling as a normal{" "}
                <code>notice</code>.
              </li>
            </ul>
          </ul>
          <h3>Flexbox</h3>
          <ul>
            <li>
              <code>&lt;* class='flex'&gt;</code> makes any element a flexbox
              with vertical and horizontal center alignment{" "}
              <strong>in a row</strong>.
            </li>
            <ul>
              <li>
                <code>&lt;* class='flex column'&gt;</code> vertical and
                horizontal alignment <strong>in a column</strong>.
              </li>
              <li>
                <code>&lt;* class='flex wrap'&gt;</code> applies flex wrap to
                the element.
              </li>
            </ul>
          </ul>
          <h3>Grids</h3>
          <ul>
            <li>
              <code>
                &lt;div class='grid one / two / three / four / five'&gt;
              </code>{" "}
              creates a grid with a specified column count.
            </li>
            <li>
              <code>&lt;div class='grid gap'&gt;</code> adds the standard gap to
              the grid.
            </li>
            <ul>
              <li>
                <code>
                  &lt;div class='grid'&gt; &lt;* class='span c-2 / 3 / 4 /
                  5'&gt;&lt;/*&gt; &lt;/div&gt;
                </code>{" "}
                creates a grid item that spans multiple columns, going from 2 to
                5.
              </li>
              <li>
                <code>
                  &lt;div class='grid'&gt; &lt;* class='span r-2 / 3 / 4 /
                  5'&gt;&lt;/*&gt; &lt;/div&gt;
                </code>{" "}
                creates a grid item that spans multiple rows, going from 2 to 5.
              </li>
              <li>
                <strong>
                  These grid span items are all reduced to 2 on mobile for
                  responsive design.
                </strong>
              </li>
            </ul>
          </ul>
          <h3>Container widths and heights</h3>
          <ul>
            <li>
              <code>&lt;* class='width-xs'&gt;</code> 20% viewport width
            </li>
            <li>
              <code>&lt;* class='width-s'&gt;</code> 30% viewport width
            </li>
            <li>
              <code>&lt;* class='width-m'&gt;</code> 50% viewport width
            </li>
            <li>
              <code>&lt;* class='width-l'&gt;</code> 80% viewport width
            </li>
            <li>
              <code>&lt;* class='width-xl'&gt;</code> 100% viewport width
            </li>
            <li>
              <code>&lt;* class='width-100'&gt;</code> 100%{" "}
              <strong>parent</strong> width
            </li>
            <li>
              <code>&lt;* class='height-100'&gt;</code> 100%{" "}
              <strong>parent</strong> height
            </li>
            <li>
              <code>&lt;* class='fullscreen'&gt;</code> 100% of the entire
              viewport (width and height)
            </li>
          </ul>
        </div>
      </article>
      <br />
      <section>
        <h2 id="ideas">Style ideas</h2>
        <div>
          <p>
            Here are some things you can create without the need for an extended
            list of classes.
          </p>
          <h3>Grid of cards</h3>
          <div className="grid three gap">
            <div className="card">Text 1</div>
            <div className="card">Text 2</div>
            <div className="card">Text 3</div>
          </div>
          <pre>
            <code>
              &lt;div class='grid three gap'&gt;{"\n"}
              {"\t"}&lt;div class='card'&gt; Text 1 &lt;/div&gt;{"\n"}
              {"\t"}&lt;div class='card'&gt; Text 2 &lt;/div&gt;{"\n"}
              {"\t"}&lt;div class='card'&gt; Text 2 &lt;/div&gt;{"\n"}
              &lt;/div&gt;
            </code>
          </pre>
          <h3>Bento grid</h3>
          <div className="grid five gap">
            <div className="card span c-2"> Text 1 </div>
            <div className="card"> Text 2</div>
            <div className="card span c-2 r-2"> Text 3 </div>
            <div className="card"> Text 4</div>
            <div className="card span c-2"> Text 5 </div>
          </div>
          <pre>
            <code>
              &lt;div class='grid five gap'&gt;{"\n"}
              {"\t"}&lt;div class='card <strong>span c-2</strong>'&gt; Text 1
              &lt;/div&gt;{"\n"}
              {"\t"}&lt;div class='card'&gt; Text 2 &lt;/div&gt;{"\n"}
              {"\t"}&lt;div class='card <strong>span c-2 r-2</strong>'&gt; Text
              3 &lt;/div&gt;{"\n"}
              {"\t"}&lt;div class='card'&gt; Text 4 &lt;/div&gt;{"\n"}
              {"\t"}&lt;div class='card <strong>span c-2</strong>'&gt; Text 5
              &lt;/div&gt;{"\n"}&lt;/div&gt;
            </code>
          </pre>
        </div>
      </section>
      <footer>
        <section>
          <nav>
            <a href="https://opensource.org/license/mit/" target="_blank">
              MIT license
            </a>
            <a href="https://github.com/tygzy/silicon" target="_blank">
              Github
            </a>
            <a href="/silicon.min.css" target="_blank">
              Download
            </a>
          </nav>
        </section>
      </footer>
    </div>
  );
}

export default App;
