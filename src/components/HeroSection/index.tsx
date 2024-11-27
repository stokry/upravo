import React from 'react';
import { LeftSection } from './LeftSection';
import { CenterSection } from './CenterSection';
import { RightSection } from './RightSection';
import type { Article } from '../../types/Article';
import { generateArticleUrl } from '../../utils/urlUtils';

interface HeroSectionProps {
  articles: Article[];
}

export function HeroSection({ articles }: HeroSectionProps) {
  if (!articles.length) return null;

  const leftArticles = articles.slice(0, 2);
  const mainArticle = articles[2];
  const centerBulletArticles = articles.slice(3, 5);
  const rightArticles = articles.slice(5, 10);

  if (!mainArticle) return null;

  return (
    <div className="container-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6">
        <LeftSection articles={leftArticles} />
        <CenterSection mainArticle={mainArticle} bulletArticles={centerBulletArticles} />
        <RightSection articles={rightArticles} />
      </div>
    </div>
  );
}