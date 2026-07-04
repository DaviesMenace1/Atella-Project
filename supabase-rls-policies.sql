-- =====================================================
-- Attela Beach Resort - Row Level Security Policies
-- Apply this AFTER running supabase-schema.sql
-- =====================================================

-- =====================================================
-- PROFILES POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Super admins can manage all profiles" ON profiles;
CREATE POLICY "Super admins can manage all profiles" ON profiles
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- =====================================================
-- BOOKINGS POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Public can insert bookings" ON bookings;
CREATE POLICY "Public can insert bookings" ON bookings
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Staff and above can view all bookings" ON bookings;
CREATE POLICY "Staff and above can view all bookings" ON bookings
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('staff', 'admin', 'super_admin')
  );

DROP POLICY IF EXISTS "Staff and above can update bookings" ON bookings;
CREATE POLICY "Staff and above can update bookings" ON bookings
  FOR UPDATE USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('staff', 'admin', 'super_admin')
  );

-- =====================================================
-- EXPERIENCES POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Public can view active experiences" ON experiences;
CREATE POLICY "Public can view active experiences" ON experiences
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Staff and above can manage experiences" ON experiences;
CREATE POLICY "Staff and above can manage experiences" ON experiences
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('staff', 'admin', 'super_admin')
  );

-- =====================================================
-- EVENTS POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Public can view active events" ON events;
CREATE POLICY "Public can view active events" ON events
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Staff and above can manage events" ON events;
CREATE POLICY "Staff and above can manage events" ON events
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('staff', 'admin', 'super_admin')
  );

-- =====================================================
-- GALLERY_ITEMS POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Public can view gallery" ON gallery_items;
CREATE POLICY "Public can view gallery" ON gallery_items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff and above can manage gallery" ON gallery_items;
CREATE POLICY "Staff and above can manage gallery" ON gallery_items
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('staff', 'admin', 'super_admin')
  );

-- =====================================================
-- MENU_ITEMS POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Public can view menu" ON menu_items;
CREATE POLICY "Public can view menu" ON menu_items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage menu" ON menu_items;
CREATE POLICY "Admin can manage menu" ON menu_items
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
  );

-- =====================================================
-- AVAILABILITY_BLOCKS POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Public can view availability blocks" ON availability_blocks;
CREATE POLICY "Public can view availability blocks" ON availability_blocks
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage availability blocks" ON availability_blocks;
CREATE POLICY "Admin can manage availability blocks" ON availability_blocks
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
  );

-- =====================================================
-- SITE_SETTINGS POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Public can view site settings" ON site_settings;
CREATE POLICY "Public can view site settings" ON site_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage site settings" ON site_settings;
CREATE POLICY "Admin can manage site settings" ON site_settings
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
  );

-- =====================================================
-- AUDIT_LOG POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Super admin can view audit log" ON audit_log;
CREATE POLICY "Super admin can view audit log" ON audit_log
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

DROP POLICY IF EXISTS "Authenticated users can insert audit logs" ON audit_log;
CREATE POLICY "Authenticated users can insert audit logs" ON audit_log
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- END OF RLS POLICIES
-- =====================================================
