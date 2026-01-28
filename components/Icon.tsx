
import React from 'react';
import { Target, Globe, Lightbulb, User, MessageCircle, ArrowRight, Sparkles, Shuffle, Search, Home, Share2, Moon, Sun, Monitor, Copy, X, Info } from 'lucide-react';

export const IconMap: Record<string, React.FC<any>> = {
  Target,
  Globe,
  Lightbulb,
  User,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Shuffle,
  Search,
  Home,
  Share2,
  Moon,
  Sun,
  Monitor,
  Copy,
  X,
  Info
};

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className, size = 24 }) => {
  const IconComponent = IconMap[name] || MessageCircle;
  return <IconComponent className={className} size={size} />;
};
