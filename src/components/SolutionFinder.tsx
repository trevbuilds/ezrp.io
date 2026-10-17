import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronDown, Globe, Layers, Factory } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { allCountries, allIndustries, dialUpFor } from "@/content/context";
import { childrenOf, pillars } from "@/content/guides";
import { serialisePicks } from "@/content/scope";

/**
 * The homepage entry point: three questions that land on /start with the
 * answers already filled in.
 *
 * Nothing is asserted here. Industries and countries come from context.ts, the
 * areas are the same ERP modules the /start picker lists, and the sector's
 * dominant modules are read from its dial-up. The only thing this adds is the
 * order and the guide counts, so a visitor sees where the content is.
 */

const erpModules = pillars.filter((module) => module.domain && module.domain !== "Delivery");

type Option = { value: string; label: string; hint?: string | undefined };

export function SolutionFinder() {
  const navigate = useNavigate();
  const [industry, setIndustry] = useState<string>();
  const [area, setArea] = useState<string>();
  const [country, setCountry] = useState<string>();

  const dominant = useMemo(
    () => new Set(industry ? (dialUpFor(industry as never)?.dominates ?? []) : []),
    [industry],
  );

  const areaOptions = useMemo(() => {
    const options = erpModules.map<Option & { first: boolean }>((module) => {
      const count = childrenOf(module.slug).length;
      return {
        value: module.slug,
        label: module.topic,
        hint: count > 0 ? `${count} ${count === 1 ? "guide" : "guides"}` : undefined,
        first: dominant.has(module.slug),
      };
    });
    // Sector-dominant modules first, otherwise the model's own order.
    return [...options.filter((o) => o.first), ...options.filter((o) => !o.first)];
  }, [dominant]);

  const industryOptions: Option[] = allIndustries.map((value) => ({ value, label: value }));
  const countryOptions: Option[] = allCountries.map((value) => ({ value, label: value }));

  const go = () =>
    navigate({
      to: "/start",
      search: {
        industry,
        changing: serialisePicks(area ? [area] : []),
        country,
      },
    });

  return (
    <div className="rounded-lg border border-border bg-surface p-5 md:p-6">
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
        <Step
          n={1}
          icon={<Factory className="size-4" />}
          placeholder="Select your industry"
          options={industryOptions}
          value={industry}
          onChange={(value) => {
            setIndustry(value);
            // A new sector reorders the areas, so the old pick no longer
            // means what it did. Same rule as the Mistras finder: change an
            // earlier answer and the later ones clear.
            setArea(undefined);
          }}
        />
        <Step
          n={2}
          icon={<Layers className="size-4" />}
          placeholder="Select an area you're changing"
          options={areaOptions}
          value={area}
          onChange={setArea}
          disabled={!industry}
          groupLabel={dominant.size > 0 ? "Dominant in your sector first" : undefined}
          highlight={(o) => dominant.has(o.value)}
        />
        <Step
          n={3}
          icon={<Globe className="size-4" />}
          placeholder="Select your country"
          options={countryOptions}
          value={country}
          onChange={setCountry}
          disabled={!area}
        />
        <Button onClick={go} disabled={!industry} className="md:self-stretch">
          Start <ArrowRight />
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Only the industry is required. You can refine everything on the next page.
      </p>
    </div>
  );
}

function Step({
  n,
  icon,
  placeholder,
  options,
  value,
  onChange,
  disabled,
  groupLabel,
  highlight,
}: {
  n: number;
  icon: ReactNode;
  placeholder: string;
  options: Option[];
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  disabled?: boolean | undefined;
  groupLabel?: string | undefined;
  highlight?: ((option: Option) => boolean) | undefined;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={`Step ${n}: ${placeholder}`}
          className="flex h-11 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-left text-sm transition-colors hover:border-primary/60 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-primary">{icon}</span>
          <span className={selected ? "flex-1 truncate" : "flex-1 truncate text-muted-foreground"}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-64 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandEmpty>Nothing matches.</CommandEmpty>
            <CommandGroup {...(groupLabel ? { heading: groupLabel } : {})}>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value === value ? undefined : option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={option.value === value ? "mr-2 size-4" : "mr-2 size-4 opacity-0"}
                  />
                  <span className={highlight?.(option) ? "font-medium" : undefined}>
                    {option.label}
                  </span>
                  {option.hint && (
                    <span className="ml-auto pl-3 text-xs text-muted-foreground">
                      {option.hint}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
