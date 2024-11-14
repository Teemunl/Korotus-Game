// src/components/ui/alert-dialog.jsx
import * as React from "react"
import PropTypes from "prop-types"
import { cn } from "../../lib/utils"

const AlertDialog = React.forwardRef(({ className, children, open = false, ...props }, ref) => {
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div
        ref={ref}
        className={cn(
          "relative bg-background w-full max-w-lg p-6 shadow-lg transition-all rounded-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
})

AlertDialog.displayName = "AlertDialog"
AlertDialog.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  open: PropTypes.bool
}

const AlertDialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("grid gap-4", className)}
    {...props}
  >
    {children}
  </div>
))

AlertDialogContent.displayName = "AlertDialogContent"
AlertDialogContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

const AlertDialogHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
    {...props}
  />
))

AlertDialogHeader.displayName = "AlertDialogHeader"
AlertDialogHeader.propTypes = {
  className: PropTypes.string
}

const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))

AlertDialogTitle.displayName = "AlertDialogTitle"
AlertDialogTitle.propTypes = {
  className: PropTypes.string
}

const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))

AlertDialogDescription.displayName = "AlertDialogDescription"
AlertDialogDescription.propTypes = {
  className: PropTypes.string
}

const AlertDialogFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
))

AlertDialogFooter.displayName = "AlertDialogFooter"
AlertDialogFooter.propTypes = {
  className: PropTypes.string
}

const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      "disabled:pointer-events-none disabled:opacity-50",
      "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      "h-9 px-4 py-2",
      className
    )}
    {...props}
  />
))

AlertDialogAction.displayName = "AlertDialogAction"
AlertDialogAction.propTypes = {
  className: PropTypes.string
}

const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      "disabled:pointer-events-none disabled:opacity-50",
      "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
      "h-9 px-4 py-2 mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))

AlertDialogCancel.displayName = "AlertDialogCancel"
AlertDialogCancel.propTypes = {
  className: PropTypes.string
}

export {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel
  }
export const AlertDialogPortal = AlertDialog
export const AlertDialogOverlay = AlertDialog
