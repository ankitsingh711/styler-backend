# Toast Notification System - Usage Guide

## 📢 Overview
A modern, customizable toast notification system with auto-dismiss, animations, and multiple alert types (success, error, warning, info).

---

## 🎨 Features

✅ **4 Toast Types**: Success, Error, Warning, Info  
✅ **Auto-dismiss**: Configurable duration  
✅ **Smooth Animations**: Slide-in and fade-out effects  
✅ **Progress Bar**: Visual countdown indicator  
✅ **Manual Close**: Close button on each toast  
✅ **Queue Management**: Multiple toasts stack vertically  
✅ **Fully Responsive**: Mobile-friendly design  
✅ **Accessible**: Proper ARIA labels  

---

## 🚀 How to Use

### 1. Import the Hook
```javascript
import { useToast } from '../context/ToastContext';
```

### 2. Get Toast Functions
```javascript
const Component = () => {
    const { success, error, warning, info, showToast } = useToast();
    
    // Your component code...
};
```

### 3. Show Toasts

#### Success Toast
```javascript
// Default duration (3 seconds)
success('Operation completed successfully!');

// Custom duration (5 seconds)
success('Profile updated!', 5000);

// No auto-dismiss (duration = 0)
success('Important message', 0);
```

#### Error Toast
```javascript
error('Failed to save changes');
error('Network error occurred', 4000);
```

#### Warning Toast
```javascript
warning('Please verify your email address');
warning('Session will expire in 5 minutes', 6000);
```

#### Info Toast
```javascript
info('New features available!');
info('Check out our latest updates', 3500);
```

#### Custom Toast
```javascript
showToast('Custom message', 'success', 3000);
showToast('Another message', 'warning', 5000);
```

---

## 💡 Real-World Examples

### Example 1: Form Submission
```javascript
import { useToast } from '../context/ToastContext';

const MyForm = () => {
    const { success, error } = useToast();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await submitFormData();
            success('Form submitted successfully!');
        } catch (err) {
            error('Failed to submit form. Please try again.');
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            {/* form fields */}
        </form>
    );
};
```

### Example 2: API Operations
```javascript
const DataFetcher = () => {
    const { info, error } = useToast();
    
    const fetchData = async () => {
        info('Loading data...');
        
        try {
            const response = await api.get('/data');
            // Process data
        } catch (err) {
            error('Failed to load data');
        }
    };
    
    return <button onClick={fetchData}>Fetch Data</button>;
};
```

### Example 3: User Actions
```javascript
const ProfileActions = () => {
    const { success, warning } = useToast();
    
    const handleDelete = () => {
        warning('This action cannot be undone', 5000);
        // Show confirmation dialog
    };
    
    const handleSave = async () => {
        await saveProfile();
        success('Profile saved successfully!');
    };
    
    return (
        <>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleDelete}>Delete</button>
        </>
    );
};
```

### Example 4: Multiple Toasts
```javascript
const MultiToast = () => {
    const { success, info } = useToast();
    
    const handleMultipleOperations = async () => {
        info('Processing request...');
        
        await operation1();
        success('Step 1 completed');
        
        await operation2();
        success('Step 2 completed');
        
        await operation3();
        success('All steps completed!');
    };
    
    return <button onClick={handleMultipleOperations}>Start Process</button>;
};
```

---

## 🎛️ Advanced Usage

### Remove Specific Toast
```javascript
const { showToast, removeToast } = useToast();

const handleAction = () => {
    const toastId = showToast('Processing...', 'info', 0);
    
    // Later, remove it
    setTimeout(() => {
        removeToast(toastId);
    }, 5000);
};
```

### Clear All Toasts
```javascript
const { clearAll } = useToast();

const handleClearAll = () => {
    clearAll(); // Removes all active toasts
};
```

### Get Active Toasts
```javascript
const { toasts } = useToast();

// toasts is an array of active toast objects
console.log('Active toasts:', toasts.length);
```

---

## 🎨 Toast Types & Colors

### Success (Green)
- Background: Light green gradient
- Border: Green (#10b981)
- Icon: Check circle
- **Use for**: Successful operations, confirmations

### Error (Red)
- Background: Light red gradient
- Border: Red (#ef4444)
- Icon: X circle
- **Use for**: Errors, failures, critical issues

### Warning (Orange)
- Background: Light orange gradient
- Border: Orange (#f59e0b)
- Icon: Warning triangle
- **Use for**: Warnings, cautions, important notes

### Info (Blue)
- Background: Light blue gradient
- Border: Blue (#3b82f6)
- Icon: Info circle
- **Use for**: Information, tips, notifications

---

## ⚙️ Configuration

### Default Duration
Toast messages auto-dismiss after **3 seconds (3000ms)** by default.

### Custom Duration
```javascript
success('Message', 5000);  // 5 seconds
warning('Alert', 10000);   // 10 seconds
info('Info', 0);           // No auto-dismiss
```

### Position
Toasts appear in the **top-right corner** of the screen.

### Z-index
Toasts have a z-index of **9999** to appear above all content.

---

## 📱 Responsive Behavior

### Desktop
- Fixed position: top-right
- Max width: 420px
- Right margin: 20px

### Tablet
- Full width with horizontal padding
- Top margin adjusted for navbar

### Mobile
- Full width (minus padding)
- Smaller font sizes
- Reduced padding
- Stacks vertically

---

## 🎭 Animation Details

### Entry Animation
- **Name**: `slideInRight`
- **Duration**: 0.3s
- **Easing**: ease-out
- Slides from right with fade-in

### Exit Animation
- **Name**: `slideOutRight`
- **Duration**: 0.3s
- **Easing**: ease-in
- Slides to right with fade-out

### Progress Bar
- **Animation**: Linear progress from 100% to 0%
- **Duration**: Matches toast duration
- Visual indicator of remaining time

### Hover Effect
- Slight translation to left (-4px)
- Enhanced shadow
- Smooth transition

---

## 🎯 Best Practices

### ✅ Do's
- Use **success** for completed actions
- Use **error** for failures and problems
- Use **warning** for important alerts
- Use **info** for helpful tips
- Keep messages **short and clear**
- Use appropriate duration based on message importance

### ❌ Don'ts
- Don't show too many toasts at once (overwhelming)
- Don't use long paragraphs in toasts
- Don't use toasts for critical errors (use modals)
- Don't set duration to 0 unless necessary
- Don't spam toasts on every action

---

## 🔧 Customization

### Modify Toast Styles
Edit `/client/src/components/common/Toast.css`:

```css
/* Change position */
.toast-container {
    top: 80px;      /* Distance from top */
    right: 20px;    /* Distance from right */
}

/* Change animation duration */
@keyframes slideInRight {
    /* Modify animation */
}

/* Change colors */
.toast-success {
    border-color: #your-color;
}
```

### Modify Default Duration
Edit `/client/src/context/ToastContext.jsx`:

```javascript
const showToast = useCallback((message, type = 'info', duration = 5000) => {
    // Changed from 3000 to 5000
    // ...
});
```

---

## 🐛 Troubleshooting

### Toasts Not Appearing
- Check if `ToastProvider` is wrapped around your app
- Check if `ToastContainer` is rendered
- Verify imports are correct

### Toasts Not Auto-Dismissing
- Check if duration is set to 0
- Verify setTimeout is working

### Styling Issues
- Check if Toast.css is imported
- Verify CSS variables are defined in index.css
- Check for conflicting z-index values

---

## 📚 Complete API Reference

### ToastContext Methods

```typescript
interface ToastContext {
    // Show toast with custom type
    showToast(message: string, type: string, duration: number): number;
    
    // Show success toast
    success(message: string, duration?: number): number;
    
    // Show error toast
    error(message: string, duration?: number): number;
    
    // Show warning toast
    warning(message: string, duration?: number): number;
    
    // Show info toast
    info(message: string, duration?: number): number;
    
    // Remove specific toast
    removeToast(id: number): void;
    
    // Clear all toasts
    clearAll(): void;
    
    // Active toasts array
    toasts: Toast[];
}

interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration: number;
}
```

---

## 🎉 Implementation Status

✅ **Backend**: Fully integrated with Login & AdminLogin  
✅ **Frontend**: Toast system ready for all components  
✅ **Styling**: Modern, responsive design  
✅ **Animations**: Smooth entry/exit effects  
✅ **Accessibility**: ARIA labels included  

---

## 📝 Files Created

1. `/client/src/context/ToastContext.jsx` - Toast context provider
2. `/client/src/components/common/Toast.jsx` - Individual toast component
3. `/client/src/components/common/ToastContainer.jsx` - Toast container
4. `/client/src/components/common/Toast.css` - Toast styles

## 📝 Files Modified

1. `/client/src/App.jsx` - Added ToastProvider and ToastContainer
2. `/client/src/pages/Login.jsx` - Integrated toast notifications
3. `/client/src/pages/admin/AdminLogin.jsx` - Integrated toast notifications

---

## 🚀 Next Steps

Use toast notifications in:
- [ ] Services page (booking confirmations)
- [ ] Profile page (update notifications)
- [ ] Admin pages (CRUD operations)
- [ ] API interceptor (network errors)
- [ ] Form validations
- [ ] Data fetching operations

---

**Happy Toasting! 🎉**
