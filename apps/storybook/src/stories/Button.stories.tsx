import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@kseniya333/button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Button variant style',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
    disabled: false,
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Disabled Button',
    disabled: true,
  },
};

export const LongText: Story = {
  args: {
    variant: 'primary',
    children: 'Button with longer text content',
    disabled: false,
  },
};
