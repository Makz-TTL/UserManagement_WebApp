import { PropsWithChildren } from "@kitajs/html"

type InputProps = PropsWithChildren<{}>

export default ({ children }: InputProps) => (

    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>User Management</title>
        
        {/* <link rel="stylesheet" href="/public/style.css" /> */}
        {/* <link rel="stylesheet" href="/public/styleApple.css" /> */}
        {/* <link rel="stylesheet" href="/public/styleModern.css" /> */}
                <link rel="stylesheet" href="/public/style3.css" />

      </head>
      <body>
        <main class="container">
          {children}
        </main>
      </body>
    </html>
  );
