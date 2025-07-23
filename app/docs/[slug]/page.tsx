'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Calendar, Tag } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';
import { Page } from '@/types';
import { fetchData } from '@/lib/api';
import { IconRenderer } from '@/components/icon-renderer';

interface PageProps {
  params: { slug: string };
}

export default function DocPage({ params }: PageProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const data = await fetchData();
      const foundPage = data.pages.find(p => p.slug === params.slug);

      if (!foundPage) {
        notFound();
      }

      setPage(foundPage);
    } catch (error) {
      console.error('Error loading data:', error);
      notFound();
    } finally {
      setLoading(false);
    }
  }, [params.slug]);

  // Function to render icons in content
  const renderContentWithIcons = (content: string) => {
    return content.replace(
      /<span[^>]*data-icon="([^"]*)"[^>]*data-color="([^"]*)"[^>]*data-size="([^"]*)"[^>]*>\[([^\]]*)\]<\/span>/g,
      (match, iconName, iconColor, iconSize, iconText) => {
        if (!iconName || iconName === 'null') {
          return `[icon]`;
        }
        const IconComponent = (LucideIcons as any)[iconName];
        if (!IconComponent) {
          return `[${iconName}]`;
        }
        return `<span class="inline-icon" style="color: ${iconColor || 'currentColor'}; display: inline-flex; align-items: center; margin: 0 2px; vertical-align: middle;">
          <svg width="${iconSize || '16'}" height="${iconSize || '16'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.25em;">
            ${getIconSvgPath(iconName)}
          </svg>
        </span>`;
      }
    );
  };

  useEffect(() => {
    const appState = process.env.NEXT_PUBLIC_APP_STATE;
    setIsEditMode(appState === 'edit');
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header isEditMode={isEditMode} />
        <div className="flex">
          <Sidebar isEditMode={isEditMode} />
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded-lg w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-4/5"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!page) {
    notFound();
  }

  // Helper function to get SVG path for icons (simplified version)
  const getIconSvgPath = (iconName: string) => {
    const iconPaths: Record<string, string> = {
      'BarChart2': '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
      'Code': '<polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/>',
      'Code2': '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>',
      'DownloadCloud': '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/>',
      'Eye': '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
      'FileVideo': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m10 15.5 4-2.5-4-2.5v5z"/>',
      'FileDown': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/>',
      'FlaskConical': '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
      'Hexagon': '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>',
      'Key': '<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>',
      'Layers': '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
      'LayoutDashboard': '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
      'LucideBarChartHorizontalBig': '<rect width="6" height="14" x="2" y="5" rx="2"/><rect width="6" height="10" x="12" y="7" rx="2"/><rect width="6" height="6" x="22" y="9" rx="2"/>',
      'Maximize': '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
      'Minimize': '<path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/>',
      'Moon': '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
      'Sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
      'Package': '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
      'Pencil': '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
      'PieChart': '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="m22 12A10 10 0 0 0 12 2v10z"/>',
      'Power': '<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/>',
      'Puzzle': '<path d="M19.439 7.85c-.049.322-.059.648-.026.975.056.506.194.958.5 1.335.34.389.85.594 1.348.594.492 0 .98-.218 1.294-.687.154-.23.239-.497.239-.776 0-.408-.155-.796-.43-1.084-.275-.29-.634-.459-1.018-.459-.369 0-.714.178-.934.467-.16.211-.252.469-.252.735 0 .199.044.393.117.573"/><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M5.04 14.147c-.892.991-1.787 2.047-2.014 3.325-.2 1.127.164 2.292 1.09 3.218.926.926 2.091 1.29 3.218 1.09 1.278-.227 2.334-1.122 3.325-2.014.991-.892 2.047-1.787 3.325-2.014 1.127-.2 2.292.164 3.218 1.09.926.926 1.29 2.091 1.09 3.218-.227 1.278-1.122 2.334-2.014 3.325-.892.991-1.787 2.047-2.014 3.325-.2 1.127.164 2.292 1.09 3.218.926.926 2.091 1.29 3.218 1.09 1.278-.227 2.334-1.122 3.325-2.014"/>',
      'ShieldCheck': '<path d="M20 13c0 5-3.5 7.5-8 7.5S4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
      'ShipWheel': '<circle cx="12" cy="12" r="8"/><path d="m12 2 3 10-3-1-3 1Z"/><path d="M12 22V12"/><path d="m17 20.5-5-8 5-3 5 8Z"/><path d="M2 12h10"/><path d="M22 12h-10"/><path d="m7 3.5 5 8-5 3-5-8Z"/>',
      'Plus': '<path d="M12 5v14"/><path d="M5 12h14"/>',
      'Search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
      'Settings': '<circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m17-4a4 4 0 0 1-8 0 4 4 0 0 1 8 0ZM7 12a4 4 0 0 1-8 0 4 4 0 0 1 8 0Z"/>',
      'Star': '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>',
      'Scroll': '<path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v11a2 2 0 0 0 2 2z"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/>',
      'Trash': '<polyline points="3,6 5,6 21,6"/><path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>',
      'UploadCloud': '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/>',
      'Users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m22 21-3.5-3.5a4 4 0 0 0-7 0L8 21"/>',
    };
    
    return iconPaths[iconName] || '<circle cx="12" cy="12" r="2"/>';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header isEditMode={isEditMode} />
        <div className="flex">
          <Sidebar isEditMode={isEditMode} />
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded-lg w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-4/5"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isEditMode={isEditMode} />

      <div className="flex">
        <Sidebar isEditMode={isEditMode} />

        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {page.icon && (() => {
                      const IconComponent = (LucideIcons as any)[page.icon];
                      return IconComponent ? (
                        <IconComponent 
                          className="h-8 w-8 text-primary" 
                          style={{ color: page.iconColor || 'currentColor' }}
                        />
                      ) : null;
                    })()}
                    <h1 className="text-3xl font-bold">{page.title}</h1>
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">
                    {page.description}
                  </p>
                </div>

                {isEditMode && (
                  <Button asChild variant="outline">
                    <Link href={`/admin/pages/${page.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Updated {new Date(page.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <span>Category: {page.category}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {page.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Tabs defaultValue="content" className="w-full">
              {isEditMode && (
                <TabsList className={`grid w-full ${isEditMode ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="info">Page Info</TabsTrigger>
                </TabsList>
              )}

              <TabsContent value="content" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: renderContentWithIcons(page.content)
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {isEditMode && (
                <TabsContent value="info" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Page Information</CardTitle>
                      <CardDescription>
                        Metadata and details about this page
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Title
                          </label>
                          <p className="mt-1">{page.title}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Slug
                          </label>
                          <p className="mt-1 font-mono text-sm">{page.slug}</p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Description
                        </label>
                        <p className="mt-1">{page.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Category
                          </label>
                          <p className="mt-1">{page.category}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Tags
                          </label>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {page.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Created
                          </label>
                          <p className="mt-1 text-sm">
                            {new Date(page.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Updated
                          </label>
                          <p className="mt-1 text-sm">
                            {new Date(page.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}