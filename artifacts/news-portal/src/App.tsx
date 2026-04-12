import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import NewsLayout from "@/components/NewsLayout";
import AdminLayout from "@/components/AdminLayout";

import Home from "@/pages/Home";
import ArticleDetail from "@/pages/ArticleDetail";
import CategoryList from "@/pages/CategoryList";
import Search from "@/pages/Search";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminArticles from "@/pages/admin/AdminArticles";
import AdminArticleForm from "@/pages/admin/AdminArticleForm";
import AdminCategories from "@/pages/admin/AdminCategories";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Switch>
            <Route path="/admin" component={AdminLogin} />
            <Route path="/admin/*">
              <AdminLayout>
                <Switch>
                  <Route path="/admin/dashboard" component={AdminDashboard} />
                  <Route path="/admin/articles" component={AdminArticles} />
                  <Route path="/admin/articles/new" component={AdminArticleForm} />
                  <Route path="/admin/articles/:id/edit" component={AdminArticleForm} />
                  <Route path="/admin/categories" component={AdminCategories} />
                  <Route component={NotFound} />
                </Switch>
              </AdminLayout>
            </Route>
            <Route path="*">
              <NewsLayout>
                <Switch>
                  <Route path="/" component={Home} />
                  <Route path="/article/:id" component={ArticleDetail} />
                  <Route path="/category/:slug" component={CategoryList} />
                  <Route path="/search" component={Search} />
                  <Route component={NotFound} />
                </Switch>
              </NewsLayout>
            </Route>
          </Switch>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
