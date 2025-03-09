import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                if (theme) {
                  document.body.className = theme;
                  document.documentElement.setAttribute('data-theme', theme);
                }
              })();
            `
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
