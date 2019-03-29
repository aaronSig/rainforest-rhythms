import React from "react";
import styles from "./Article.module.css";
import ArticleFooter from "./ArticleFooter";
import ArticleNavigation from "./ArticleNavigation";

interface ArticleProps {
  children: any;
}

// Applys the styling for Markdown content
function Article(props: ArticleProps) {
  return (
    <div className={styles.ArticleContainer}>
      <ArticleNavigation />
      <div className={styles.Article}>{props.children}</div>
      <ArticleFooter />
    </div>
  );
}

export default Article;
