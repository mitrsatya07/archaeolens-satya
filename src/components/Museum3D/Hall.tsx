/* The museum hall: floor, walls, ceiling strip lights, atmosphere */

export const HALL = { halfWidth: 15, halfLength: 34, height: 6.5 };

export const Hall: React.FC = () => (
  <group>
    {/* floor */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[HALL.halfWidth * 2, HALL.halfLength * 2]} />
      <meshStandardMaterial color="#17130f" roughness={0.4} metalness={0.15} />
    </mesh>
    {/* walls */}
    <mesh position={[-HALL.halfWidth, HALL.height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[HALL.halfLength * 2, HALL.height]} />
      <meshStandardMaterial color="#241f19" roughness={0.95} />
    </mesh>
    <mesh position={[HALL.halfWidth, HALL.height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
      <planeGeometry args={[HALL.halfLength * 2, HALL.height]} />
      <meshStandardMaterial color="#241f19" roughness={0.95} />
    </mesh>
    {/* end walls */}
    <mesh position={[0, HALL.height / 2, -HALL.halfLength]}>
      <planeGeometry args={[HALL.halfWidth * 2, HALL.height]} />
      <meshStandardMaterial color="#241f19" roughness={0.95} />
    </mesh>
    <mesh position={[0, HALL.height / 2, HALL.halfLength]} rotation={[0, Math.PI, 0]}>
      <planeGeometry args={[HALL.halfWidth * 2, HALL.height]} />
      <meshStandardMaterial color="#241f19" roughness={0.95} />
    </mesh>
    {/* ceiling */}
    <mesh position={[0, HALL.height, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[HALL.halfWidth * 2, HALL.halfLength * 2]} />
      <meshStandardMaterial color="#0d0b08" roughness={1} />
    </mesh>
    {/* glowing ceiling light strips */}
    {[-9, -3, 3, 9].map((x) => (
      <mesh key={x} position={[x, HALL.height - 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, HALL.halfLength * 1.8]} />
        <meshBasicMaterial color="#f5e6c8" />
      </mesh>
    ))}
  </group>
);
