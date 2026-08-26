import { parse } from 'yaml';
import dealsYaml from '../data/deals.yaml?raw';

export interface Deal {
  name: string;
  blurb: string;
  priceHint: string;
  goSlug: string;
  tags: string[];
  featured: boolean;
}

export function getDeals(): Deal[] {
  return parse(dealsYaml) as Deal[];
}

export function getFeaturedDeals(): Deal[] {
  return getDeals().filter((deal) => deal.featured);
}
