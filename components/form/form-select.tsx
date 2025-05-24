'use client';

import { useFormContext, Controller } from 'react-hook-form';
import ReactSelect, { Props as ReactSelectProps } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

type FormSelectProps = {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  options: Option[];
  disabled?: boolean;
  isMulti?: boolean;
  isCreatable?: boolean;
  isClearable?: boolean;
  className?: string;
  selectProps?: Partial<ReactSelectProps>;
};

export function FormSelect({
  name,
  label,
  placeholder,
  description,
  options,
  disabled,
  isMulti = false,
  isCreatable = false,
  isClearable = false,
  className,
  selectProps,
}: FormSelectProps) {
  const { control } = useFormContext();

  const SelectComponent = isCreatable ? CreatableSelect : ReactSelect;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Controller
              control={control}
              name={name}
              render={({ field: { onChange, value, ref, ...restField } }) => (
                <SelectComponent
                  {...restField}
                  ref={ref}
                  options={options}
                  value={
                    isMulti
                      ? Array.isArray(value) && value.length > 0
                        ? value.map((v) => {
                            const existingOption = options.find(
                              (opt) => opt.value === v
                            );

                            return existingOption || { value: v, label: v };
                          })
                        : []
                      : options.find((option) => option.value === value) || null
                  }
                  onChange={(selected) => {
                    if (isMulti && Array.isArray(selected)) {
                      onChange(selected.map((option) => option.value));
                    } else if (selected === null) {
                      onChange(null);
                    } else {
                      onChange((selected as Option).value);
                    }
                  }}
                  isMulti={isMulti}
                  isClearable={isClearable}
                  isDisabled={disabled}
                  placeholder={placeholder}
                  classNames={{
                    control: (state) =>
                      cn(
                        'border-input bg-background rounded-md shadow-sm transition-colors',
                        state.isFocused
                          ? 'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border-input'
                          : 'hover:border-ring',
                        state.isDisabled && 'opacity-50 cursor-not-allowed'
                      ),
                    placeholder: () => 'text-muted-foreground',
                    menu: () =>
                      'bg-popover border border-border rounded-md mt-1 z-50',
                    option: (state) =>
                      cn(
                        'cursor-pointer px-2 py-2',
                        state.isFocused && 'bg-accent',
                        state.isSelected && 'bg-primary text-primary-foreground'
                      ),
                    multiValue: () =>
                      'bg-accent rounded items-center py-0.5 pl-2 pr-1 gap-1.5',
                    multiValueLabel: () => 'text-sm',
                    multiValueRemove: () =>
                      'text-muted-foreground hover:text-foreground hover:bg-accent-foreground/10 rounded-sm',
                    input: () => 'text-sm',
                    valueContainer: () => 'gap-1',
                  }}
                  styles={{
                    control: (base) => ({
                      ...base,
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: 'var(--ring)',
                      },
                      borderColor: 'var(--input)',
                      '&:focus-within': {
                        borderColor: 'var(--input)',
                        boxShadow: '0 0 0 1px var(--ring)',
                        outline: 'none',
                      },
                    }),
                    indicatorSeparator: () => ({
                      display: 'none',
                    }),
                  }}
                  {...selectProps}
                />
              )}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
