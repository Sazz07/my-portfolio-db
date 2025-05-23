'use client';

import { ReactNode } from 'react';
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
  icon?: ReactNode;
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
  icon,
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
          <div className='relative'>
            {icon && (
              <div className='absolute left-3 top-3 z-10 h-4 w-4 text-muted-foreground'>
                {icon}
              </div>
            )}
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
                        ? options.filter(
                            (option) =>
                              value &&
                              Array.isArray(value) &&
                              value.includes(option.value)
                          )
                        : options.find((option) => option.value === value) ||
                          null
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
                        `${
                          icon ? 'pl-7' : ''
                        } border-input bg-background hover:border-ring ${
                          state.isFocused ? 'border-ring ring-ring ring-2' : ''
                        }`,
                      placeholder: () => 'text-muted-foreground',
                      menu: () =>
                        'bg-popover border border-border rounded-md mt-1 z-50',
                      option: (state) => `
                        ${state.isFocused ? 'bg-accent' : ''}
                        ${
                          state.isSelected
                            ? 'bg-primary text-primary-foreground'
                            : ''
                        }
                      `,
                    }}
                    {...selectProps}
                  />
                )}
              />
            </FormControl>
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
