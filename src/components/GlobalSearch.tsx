import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileCode, Server, GitCommit } from 'lucide-react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { searchAll } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const { data: results } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchAll(query),
    enabled: query.length >= 2,
    staleTime: 10000,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (type: 'jira' | 'service' | 'commit', value: string) => {
    setOpen(false);
    setQuery('');
    if (type === 'jira') {
      navigate(`/jira/${value}`);
    } else if (type === 'service') {
      navigate(`/services/${value}`);
    } else if (type === 'commit') {
      // Navigate to service containing the commit
      const commit = results?.commits.find((c) => c.sha === value);
      if (commit) {
        navigate(`/services/${commit.serviceName}`);
      }
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-64 justify-start text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Search...</span>
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search Jira keys, services, or commits..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {results?.jiraIssues && results.jiraIssues.length > 0 && (
            <CommandGroup heading="Jira Issues">
              {results.jiraIssues.map((issue) => (
                <CommandItem
                  key={issue.key}
                  onSelect={() => handleSelect('jira', issue.key)}
                >
                  <FileCode className="mr-2 h-4 w-4" />
                  <span className="font-mono mr-2">{issue.key}</span>
                  <span className="text-muted-foreground truncate">
                    {issue.title}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {results?.services && results.services.length > 0 && (
            <CommandGroup heading="Services">
              {results.services.map((service) => (
                <CommandItem
                  key={service.serviceName}
                  onSelect={() => handleSelect('service', service.serviceName)}
                >
                  <Server className="mr-2 h-4 w-4" />
                  <span>{service.serviceName}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {results?.commits && results.commits.length > 0 && (
            <CommandGroup heading="Commits">
              {results.commits.map((commit) => (
                <CommandItem
                  key={`${commit.serviceName}-${commit.sha}`}
                  onSelect={() => handleSelect('commit', commit.sha)}
                >
                  <GitCommit className="mr-2 h-4 w-4" />
                  <code className="font-mono mr-2">{commit.sha}</code>
                  <span className="text-muted-foreground">
                    in {commit.serviceName}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
