-- ============================================================
-- JAudiProjectBoard — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Projects table
create table if not exists projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  tags        text[] default '{}',
  difficulty  text default 'Intermediate',
  time_est    text default 'TBD',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Phases table
create table if not exists phases (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid references projects(id) on delete cascade,
  name         text not null,
  position     int  not null default 0,
  done         boolean default false,
  illustration text,
  created_at   timestamptz default now()
);

-- Steps table
create table if not exists steps (
  id        uuid primary key default gen_random_uuid(),
  phase_id  uuid references phases(id) on delete cascade,
  text      text not null,
  note      text default '',
  code      text default '',
  code_type text default '',
  position  int  not null default 0
);

-- Devices table (credentials vault)
create table if not exists devices (
  id       uuid primary key default gen_random_uuid(),
  type     text not null,
  name     text not null,
  ip       text default '',
  host     text default '',
  username text default '',
  extras   jsonb default '{}',
  created_at timestamptz default now()
);

-- ── DISABLE RLS for now (single-user, no auth required yet) ──
-- You can enable RLS + policies later when you add login
alter table projects disable row level security;
alter table phases   disable row level security;
alter table steps    disable row level security;
alter table devices  disable row level security;

-- ── SEED: V-Dipole project ───────────────────────────────────
insert into projects (id, title, description, tags, difficulty, time_est) values
  ('11111111-0000-0000-0000-000000000001',
   'V-Dipole Antenna Build',
   'Build a 137 MHz V-dipole for NOAA/METEOR weather satellite reception using 1/2" PVC, copper tape, and the 3D-printed hub. Includes mast setup and coax feed.',
   ARRAY['antenna','sdr','print3d'],
   'Beginner', '2-3 hours');

insert into phases (id, project_id, name, position, illustration) values
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Build the Antenna Elements', 0, 'vdipole_wiring'),
  ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'Coax Feed & Connection', 1, 'coax_strip'),
  ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', 'Mast Assembly', 2, null),
  ('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000001', 'Orientation & First Test', 3, null);

insert into steps (phase_id, text, note, position) values
  ('22222222-0000-0000-0000-000000000001', 'Cut two pieces of 1/2" PVC to exactly <strong>545mm (21.5")</strong> — λ/4 for 137.5 MHz', '', 0),
  ('22222222-0000-0000-0000-000000000001', 'Deburr both ends so copper tape lays flat', '', 1),
  ('22222222-0000-0000-0000-000000000001', 'Spiral wrap 1/4" copper tape from 10mm in from hub end toward tip. Overlap ~1/3 width, no gaps.', 'Leave 10mm bare at hub end — prevents socket bulking', 2),
  ('22222222-0000-0000-0000-000000000001', 'Fold tape over the tip end cap and press firm', '', 3),
  ('22222222-0000-0000-0000-000000000001', 'Leave a 50mm tail of tape folded back at hub end as solder/clamp tab for coax', '', 4),
  ('22222222-0000-0000-0000-000000000001', 'Repeat for arm 2 — both arms are identical', '', 5);

insert into steps (phase_id, text, note, position) values
  ('22222222-0000-0000-0000-000000000002', 'Strip coax end: <strong>30mm outer jacket, fold back braid, expose 10mm center conductor</strong>', 'See diagram above', 0),
  ('22222222-0000-0000-0000-000000000002', 'Solder or clamp center conductor to one arm''s copper tape tab', '', 1),
  ('22222222-0000-0000-0000-000000000002', 'Solder or clamp shield/braid to the other arm — does not matter which arm is which', '', 2),
  ('22222222-0000-0000-0000-000000000002', 'Route coax down through the 7mm hub hole and down through the 1/2" mast pipe', '', 3),
  ('22222222-0000-0000-0000-000000000002', 'Optional: Coil 6-8 turns of coax in ~100mm loop below hub, zip-tie — acts as a choke balun', 'Do this if you see noisy waterfall or horizontal striping in images', 4);

-- ── SEED: Proxmox SDR VM project ─────────────────────────────
insert into projects (id, title, description, tags, difficulty, time_est) values
  ('11111111-0000-0000-0000-000000000002',
   'SDR Satellite Receiver — Proxmox VM',
   'Fresh weather satellite receiver in a Proxmox VM with USB passthrough, SatDump, and automated scheduling. Pi+SDR now on ADS-B duty.',
   ARRAY['sdr','proxmox','homelab'],
   'Intermediate', '3-5 hours');

insert into phases (id, project_id, name, position, illustration) values
  ('22222222-0000-0000-0000-000000000010', '11111111-0000-0000-0000-000000000002', 'Create Proxmox VM', 0, 'proxmox_usb'),
  ('22222222-0000-0000-0000-000000000011', '11111111-0000-0000-0000-000000000002', 'Install RTL-SDR Drivers', 1, null),
  ('22222222-0000-0000-0000-000000000012', '11111111-0000-0000-0000-000000000002', 'Install SatDump & Test Pass', 2, null),
  ('22222222-0000-0000-0000-000000000013', '11111111-0000-0000-0000-000000000002', 'Automated Pass Scheduler', 3, null);

insert into steps (phase_id, text, note, code, code_type, position) values
  ('22222222-0000-0000-0000-000000000010', 'Log into Proxmox UI at <strong>https://{{PROXMOX1_IP}}:8006</strong>', 'Add your Proxmox node in Device Vault to auto-fill this', '', '', 0),
  ('22222222-0000-0000-0000-000000000010', 'Create VM → Ubuntu Server 24.04 LTS · 2 cores · 3 GB RAM · 20 GB disk', '', '', '', 1),
  ('22222222-0000-0000-0000-000000000010', 'Plug in RTL-SDR dongle → VM → Hardware → Add → USB Device → select Realtek 0bda:2838', 'Plug in before opening dialog so it appears in the list', '', '', 2);

insert into steps (phase_id, text, note, code, code_type, position) values
  ('22222222-0000-0000-0000-000000000011', 'SSH into the VM', '', 'ssh {{VM_SAT_USER}}@{{VM_SAT_IP}}', 'shell', 0),
  ('22222222-0000-0000-0000-000000000011', 'Install dependencies and rtl-sdr package', '', 'sudo apt update && sudo apt install -y git cmake build-essential libusb-1.0-0-dev rtl-sdr', 'shell', 1),
  ('22222222-0000-0000-0000-000000000011', 'Blacklist the kernel DVB driver', 'Without this the OS hijacks the device before rtl-sdr can claim it', E'echo ''blacklist dvb_usb_rtl28xxu'' | sudo tee /etc/modprobe.d/blacklist-rtl.conf\nsudo modprobe -r dvb_usb_rtl28xxu 2>/dev/null; true', 'shell', 2),
  ('22222222-0000-0000-0000-000000000011', 'Add udev rule for non-root access', '', E'sudo tee /etc/udev/rules.d/20-rtlsdr.rules <<''EOF''\nSUBSYSTEM=="usb", ATTRS{idVendor}=="0bda", ATTRS{idProduct}=="2838", MODE="0666"\nEOF\nsudo udevadm control --reload-rules && sudo udevadm trigger', 'shell', 3),
  ('22222222-0000-0000-0000-000000000011', 'Test that the dongle is visible', '', 'rtl_test -t', 'shell', 4);

-- ── SEED: ESP32 Dashboard ────────────────────────────────────
insert into projects (id, title, description, tags, difficulty, time_est) values
  ('11111111-0000-0000-0000-000000000003',
   'ESP32 Satellite Pass Dashboard',
   'Turn your ESP32-8048S050 or Elecrow CrowPanel 5" display into a wall-mounted satellite pass dashboard — next passes, countdown, live decode status.',
   ARRAY['esp32','sdr','homelab'],
   'Intermediate', '2-4 hours');

insert into phases (id, project_id, name, position, illustration) values
  ('22222222-0000-0000-0000-000000000020', '11111111-0000-0000-0000-000000000003', 'Architecture & Plan', 0, 'esp32_dashboard'),
  ('22222222-0000-0000-0000-000000000021', '11111111-0000-0000-0000-000000000003', 'Add REST API to VM Scheduler', 1, null),
  ('22222222-0000-0000-0000-000000000022', '11111111-0000-0000-0000-000000000003', 'Flash ESP32 Firmware', 2, null);

insert into steps (phase_id, text, note, code, code_type, position) values
  ('22222222-0000-0000-0000-000000000020', 'The display queries your Proxmox VM scheduler via a lightweight <strong>REST API (Flask)</strong> — no satellite math on the ESP32', '', '', '', 0),
  ('22222222-0000-0000-0000-000000000020', 'VM exposes: /api/passes · /api/status (recording?) · /api/latest (thumbnail)', '', '', '', 1),
  ('22222222-0000-0000-0000-000000000020', 'Best device: <strong>ESP32-8048S050</strong> (800×480 S3) — already in your inventory. Add it to Device Vault to auto-fill COM port and WiFi into the sketch.', '', '', '', 2);

insert into steps (phase_id, text, note, code, code_type, position) values
  ('22222222-0000-0000-0000-000000000021', 'Open firewall port on satellite VM', '', 'sudo ufw allow 5000/tcp', 'shell', 0),
  ('22222222-0000-0000-0000-000000000021', 'Test the API endpoint', '', 'curl http://{{VM_SAT_IP}}:5000/api/passes', 'shell', 1);

insert into steps (phase_id, text, note, code, code_type, position) values
  ('22222222-0000-0000-0000-000000000022', 'Open Arduino IDE. Board: ESP32S3 Dev Module · Port: {{ESP32_DASH_COMPORT}}', 'Add your ESP32 to Device Vault to auto-fill the COM port', '', '', 0),
  ('22222222-0000-0000-0000-000000000022', 'Install via Library Manager: TFT_eSPI · LVGL 8.x · ArduinoJson', '', '', '', 1),
  ('22222222-0000-0000-0000-000000000022', 'Create secrets.h — auto-filled from Device Vault:', '', E'// secrets.h\n#define WIFI_SSID  "{{ESP32_DASH_SSID}}"\n#define WIFI_PASS  "{{ESP32_DASH_WIFIPW}}"\n#define API_HOST   "{{VM_SAT_IP}}"\n#define API_PORT   5000', 'arduino', 2),
  ('22222222-0000-0000-0000-000000000022', 'Hold BOOT button on ESP32 when upload starts if it fails to connect', '', '', '', 3);
