// @ts-nocheck
import VanillaRouter from "../src/lib/router";

// Simulated auth
let isLoggedIn = false;
function loginUser() {
  isLoggedIn = true;
  return Promise.resolve();
}

const router = VanillaRouter({
  history: true,
  base: "/",
  routes: [
    {
      path: "",
      handler: (ctx) => renderView("Welcome Home!"),
    },
    {
      path: "/docs/:name?/*",
      handler: ({ query, params }) => {
        console.log(query, params);
        return renderView("Docs Page");
      },
    },
    {
      path: "/dashboard",
      middleware: [
        (ctx, next) => {
          if (!isLoggedIn) {
            // Save original path
            ctx.redirect("/login");
          }
          next();
        },
      ],
      handler: (ctx) => renderView("Dashboard: Protected Content"),
    },
    {
      path: "/login",
      handler: (ctx) => {
        renderView('<button id="loginBtn">Login</button>');
        document.getElementById("loginBtn").onclick = () => {
          loginUser().then(() => {
            const next = ctx.getNext();
            if (next) {
              router.go(next);
            } else {
              router.go("/");
            }
          });
        };
      },
    },
    {
      path: "*",
      handler: (ctx) => renderView("404 - Page Not Found"),
    },
  ],
});

// Global middleware
router.use((ctx, next) => {
  //console.log("Navigating to:", ctx.pathname);
  next();
});

// Link handling
document.addEventListener("click", (e: any) => {
  if (e.target.matches("a[data-link]")) {
    e.preventDefault();
    const link = e.target.getAttribute("href");
    router.go(link);
  }
});

function renderView(content: string) {
  console.log("LOADING...", content);
  document.getElementById("view").innerHTML = content;
}
