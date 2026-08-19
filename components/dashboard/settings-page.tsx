'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  Bell,
  KeyRound,
  Laptop,
  Moon,
  Save,
  Shield,
  Sun,
  Trash2,
  User,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

function SettingsCard({
  icon: Icon,
  title,
  description,
  children,
  destructive,
}: {
  icon: typeof User
  title: string
  description: string
  children: React.ReactNode
  destructive?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-5 shadow-sm sm:p-6',
        destructive ? 'border-destructive/30' : 'border-border',
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-lg',
            destructive
              ? 'bg-destructive/10 text-destructive'
              : 'bg-primary/10 text-primary',
          )}
        >
          <Icon className="size-5" />
        </span>
        <div>
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  )
}

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input
        {...props}
        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
      />
    </label>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string
  description: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={label}
      />
    </div>
  )
}

export function SettingsPage() {
  const { theme, setTheme } = useTheme()

  const [name, setName] = useState('Hamza')
  const [email, setEmail] = useState('hamza@daralhikma.ma')

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weeklySummary: true,
    securityAlerts: true,
  })

  const [twoFactor, setTwoFactor] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState('')

  function saveProfile() {
    toast.success('Profile updated')
  }

  function savePassword() {
    toast.success('Password updated')
  }

  function deleteAccount() {
    toast.success('Account deletion requested')
    setConfirmDelete('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          Account Settings
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage your profile, notifications, and security preferences
        </p>
      </div>

      {/* Profile */}
      <SettingsCard
        icon={User}
        title="Profile"
        description="Update your personal information"
      >
        <div className="flex items-center gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-chart-2 text-lg font-semibold text-primary-foreground">
            {name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </span>
          <div>
            <Button variant="outline" size="sm">
              Change photo
            </Button>
            <p className="mt-1.5 text-xs text-muted-foreground">
              JPG, GIF or PNG. 2MB max.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Field
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button size="sm" onClick={saveProfile}>
            <Save className="size-4" />
            Save changes
          </Button>
        </div>
      </SettingsCard>

      {/* Notifications */}
      <SettingsCard
        icon={Bell}
        title="Notifications"
        description="Choose what you want to be notified about"
      >
        <div className="divide-y divide-border">
          <ToggleRow
            label="Email notifications"
            description="Receive updates about your account via email"
            checked={notifications.email}
            onCheckedChange={(v) =>
              setNotifications((prev) => ({ ...prev, email: v }))
            }
          />
          <ToggleRow
            label="Push notifications"
            description="Get notified on your devices in real time"
            checked={notifications.push}
            onCheckedChange={(v) =>
              setNotifications((prev) => ({ ...prev, push: v }))
            }
          />
          <ToggleRow
            label="Weekly summary"
            description="A digest of your workspace activity every Monday"
            checked={notifications.weeklySummary}
            onCheckedChange={(v) =>
              setNotifications((prev) => ({ ...prev, weeklySummary: v }))
            }
          />
          <ToggleRow
            label="Security alerts"
            description="Get notified about new sign-ins and suspicious activity"
            checked={notifications.securityAlerts}
            onCheckedChange={(v) =>
              setNotifications((prev) => ({ ...prev, securityAlerts: v }))
            }
          />
        </div>
      </SettingsCard>

      {/* Appearance */}
      <SettingsCard
        icon={Sun}
        title="Appearance"
        description="Customize how the dashboard looks on your device"
      >
        <div className="grid grid-cols-3 gap-3 sm:max-w-sm">
          {(
            [
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Laptop },
            ] as const
          ).map((opt) => {
            const active = theme === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTheme(opt.id)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-lg border p-3 text-xs font-medium transition-colors',
                  active
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                )}
              >
                <opt.icon className="size-5" />
                {opt.label}
              </button>
            )
          })}
        </div>
      </SettingsCard>

      {/* Security */}
      <SettingsCard
        icon={KeyRound}
        title="Security"
        description="Manage your password and account protection"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Current password" type="password" placeholder="••••••••" />
          <div className="hidden sm:block" />
          <Field label="New password" type="password" placeholder="••••••••" />
          <Field
            label="Confirm new password"
            type="password"
            placeholder="••••••••"
          />
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/30 px-4 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Shield className="size-4.5" />
            </span>
            <div>
              <p className="text-sm font-medium">Two-factor authentication</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          <Switch
            checked={twoFactor}
            onCheckedChange={setTwoFactor}
            aria-label="Two-factor authentication"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button size="sm" onClick={savePassword}>
            <Save className="size-4" />
            Update password
          </Button>
        </div>
      </SettingsCard>

      {/* Danger zone */}
      <SettingsCard
        icon={AlertTriangle}
        title="Danger Zone"
        description="Irreversible and destructive actions"
        destructive
      >
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-foreground">
            Delete this account
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            This will permanently remove your account and all associated
            data. This action cannot be undone.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              placeholder='Type "DELETE" to confirm'
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-destructive focus-visible:ring-2 focus-visible:ring-destructive/30 sm:max-w-64"
            />
            <Button
              variant="destructive"
              size="sm"
              disabled={confirmDelete !== 'DELETE'}
              onClick={deleteAccount}
            >
              <Trash2 className="size-4" />
              Delete account
            </Button>
          </div>
        </div>
      </SettingsCard>
    </div>
  )
}
