# Real AR: anchor the burger to your actual table

Right now "Display on your table" only turns the camera on and floats the burger in front of it. It never understands the room, so it can't sit on a surface and it doesn't move correctly when you walk around. This replaces that with genuine device AR.

## What changes

**On a supported phone (most Android/Chrome devices)**
- Tapping "Display on your table" asks for camera permission and starts a true AR session.
- The phone scans for flat surfaces. A soft ring marker follows your table top as you move the phone, with a short prompt: "Move your phone slowly to find the table."
- Tap the marker and the burger is placed there at real plate size. It stays put: walk around it, crouch to eye level, and it stays anchored to that spot on the table.
- Placed burger can be dragged to reposition, twisted to rotate, and pinched to resize. A "Reset" control removes and re-places it.
- Exit returns to the dish page.

**On iPhone/iPad**
- Apple doesn't allow in-page AR sessions, so the button opens Apple's own AR viewer with the burger model, which anchors to the table natively and offers real-size placement. This is the standard, fully working iOS path.

**On a laptop or unsupported phone**
- No fake camera scene. The button says "AR needs a phone" and the dish keeps the 3D burger you can spin, with one line explaining why plus a QR code to open the dish on a phone that supports it.

## Also fixed
- The current "Anchor it to the real table" link that does nothing on desktop is removed; the AR entry point becomes a single button whose behaviour is decided by what the device actually supports.
- Real-world scale: the model is sized to a realistic burger (about 12 cm wide) rather than an arbitrary slider value.

## Technical notes

- Add `@react-three/xr` (v6). New AR component uses `createXRStore({ hitTest: true, domOverlay: true })` and an `<XR>` canvas with session mode `immersive-ar`, `requiredFeatures: ['hit-test']`, `optionalFeatures: ['dom-overlay','anchors','light-estimation']`.
- Reticle driven by `XRHitTest` / hit-test source against the viewer space; on select, place the model at the hit pose and create an `XRAnchor` when the `anchors` feature is available (fallback: fixed world matrix from the hit pose).
- Gestures via `TouchEvent` on the DOM overlay: one-finger drag = re-hit-test move, two-finger = rotate + scale.
- Support detection at mount with `navigator.xr?.isSessionSupported('immersive-ar')`; iOS detected by UA + `<a rel="ar">` with the existing USDZ asset (Quick Look); everything else gets the unsupported state.
- Light estimation feeds an `XRLightProbe`-backed environment so the burger picks up room lighting; falls back to the current Lightformer rig.
- Component stays lazy-loaded and client-only, as today. Existing 3D viewer in the dish sheet is unchanged.

## Verification

Headless browsers cannot enter a real AR session, so I will verify build health, the desktop unsupported state, the iOS Quick Look link, and the AR-session entry path programmatically; the on-table anchoring itself needs a quick check on your phone.
