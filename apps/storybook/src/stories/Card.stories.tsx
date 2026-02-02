import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@kseniya333/card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    header: {
      control: 'text',
      description: 'Header content of the card',
    },
    content: {
      control: 'text',
      description: 'Main content of the card',
    },
    footer: {
      control: 'text',
      description: 'Footer content of the card',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'This is the main content of the card.',
  },
};

export const WithHeader: Story = {
  args: {
    header: 'Card Title',
    content: 'This card has a header section with a title.',
  },
};

export const WithFooter: Story = {
  args: {
    content: 'This card has a footer section.',
    footer: 'Footer information',
  },
};

export const Complete: Story = {
  args: {
    header: 'Complete Card',
    content: 'This card demonstrates all three slots: header, content, and footer. The card component is flexible and can adapt to various content structures.',
    footer: 'Last updated: January 2025',
  },
};

export const RichContent: Story = {
  args: {
    header: (
      <div>
        <h3 style={{ margin: 0 }}>User Profile</h3>
      </div>
    ),
    content: (
      <div>
        <p style={{ margin: '0 0 12px 0' }}>
          <strong>Name:</strong> John Doe
        </p>
        <p style={{ margin: '0 0 12px 0' }}>
          <strong>Email:</strong> john.doe@example.com
        </p>
        <p style={{ margin: 0 }}>
          <strong>Role:</strong> Developer
        </p>
      </div>
    ),
    footer: (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Member since 2024</span>
        <span>Status: Active</span>
      </div>
    ),
  },
};

export const WithActions: Story = {
  args: {
    header: 'Confirm Your Action',
    content: 'Are you sure you want to proceed with this operation? This action cannot be undone.',
    actions: [
      {
        label: 'Cancel',
        variant: 'secondary',
        onClick: () => alert('Cancelled'),
      },
      {
        label: 'Confirm',
        variant: 'primary',
        onClick: () => alert('Confirmed'),
      },
    ],
  },
};

export const WithFooterAndActions: Story = {
  args: {
    header: 'Project Update',
    content: 'Your project has been successfully deployed to production. All services are running smoothly.',
    footer: 'Deployed 5 minutes ago',
    actions: [
      {
        label: 'View Details',
        variant: 'secondary',
        onClick: () => alert('View details'),
      },
      {
        label: 'Open App',
        variant: 'primary',
        onClick: () => alert('Opening app'),
      },
    ],
  },
};

export const MultipleActions: Story = {
  args: {
    header: 'Shopping Cart',
    content: 'You have 3 items in your cart totaling $149.99',
    actions: [
      {
        label: 'Continue Shopping',
        variant: 'secondary',
        onClick: () => alert('Continue shopping'),
      },
      {
        label: 'View Cart',
        variant: 'secondary',
        onClick: () => alert('View cart'),
      },
      {
        label: 'Checkout',
        variant: 'primary',
        onClick: () => alert('Checkout'),
      },
    ],
  },
};
