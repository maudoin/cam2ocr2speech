export class CatmullRomSpline
{
  static distance(p1, p2)
  {
    return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
  }

  static interpolate(p1, p2, alpha)
  {
    return {
      x: p1.x * alpha + p2.x * (1 - alpha),
      y: p1.y * alpha + p2.y * (1 - alpha)
    };
  }

  static getSplinePoint(p0, p1, p2, p3, t0, t1, t2, t3, t)
  {
    const A1 = CatmullRomSpline.interpolate(p0, p1, (t1 - t) / (t1 - t0));
    const A2 = CatmullRomSpline.interpolate(p1, p2, (t2 - t) / (t2 - t1));
    const A3 = CatmullRomSpline.interpolate(p2, p3, (t3 - t) / (t3 - t2));

    const B1 = CatmullRomSpline.interpolate(A1, A2, (t2 - t) / (t2 - t0));
    const B2 = CatmullRomSpline.interpolate(A2, A3, (t3 - t) / (t3 - t1));

    return CatmullRomSpline.interpolate(B1, B2, (t2 - t) / (t2 - t1));
  }

  static uniformGetDeltaT = () => 1;
  static centripetalGetDeltaT = (pPrev, pNext) => Math.sqrt(CatmullRomSpline.distance(pPrev, pNext));
  static chordalGetDeltaT = (pPrev, pNext) => CatmullRomSpline.distance(pPrev, pNext);

  static fillSplinePoints(p0, p1, p2, p3, getDeltaT, sampleCount)
  {
    const t0 = 0;
    const t1 = t0 + getDeltaT(p0, p1);
    const t2 = t1 + getDeltaT(p1, p2);
    const t3 = t2 + getDeltaT(p2, p3);

    // Sample curve densely
    const splinePoints = new Array(sampleCount);
    for (let j = 0; j < sampleCount; j++) {
      const t = t1 + (j / (sampleCount-1)) * (t2 - t1);
      const pt = CatmullRomSpline.getSplinePoint(p0, p1, p2, p3, t0, t1, t2, t3, t);
      splinePoints[j] = pt;
    }
    return splinePoints;
  }

  static addDist2Start(points)
  {
    // Compute cumulative distances
    points[0].dist2start = 0.;
    for (let j = 1; j < points.length; j++) {
      points[j].dist2start = points[j-1].dist2start + CatmullRomSpline.distance(points[j - 1], points[j]);
    }
  }

  static samplePointsByDistance(points, sampleCount)
  {
    CatmullRomSpline.addDist2Start(points);
    const samples = new Array(sampleCount);
    // Find marker positions
    const spacing = points[points.length - 1].dist2start / sampleCount;
    let j = 1;
    for (let m = 0; m < sampleCount; m++) {
      const targetDist = (m+1) * spacing;
      while ( j < points.length && points[j].dist2start < targetDist) j++;
      samples[m] = points[Math.min(j, points.length-1)];
    }
    return samples;
  }

  static DEFAULT_SAMPLE_COUNT = 100;

  static uniformDistanceSplinePoints(p0, p1, p2, p3, pointCount, sampleCount = CatmullRomSpline.DEFAULT_SAMPLE_COUNT)
  {
    return CatmullRomSpline.samplePointsByDistance(
      CatmullRomSpline.fillSplinePoints(p0, p1, p2, p3,
        CatmullRomSpline.uniformGetDeltaT, sampleCount), pointCount);
  }
  static centripetalDistanceSplinePoints(p0, p1, p2, p3, pointCount, sampleCount = CatmullRomSpline.DEFAULT_SAMPLE_COUNT)
  {
    return CatmullRomSpline.samplePointsByDistance(
      CatmullRomSpline.fillSplinePoints(p0, p1, p2, p3,
        CatmullRomSpline.centripetalGetDeltaT, sampleCount), pointCount);
  }
  static chordalDistanceSplinePoints(p0, p1, p2, p3, pointCount, sampleCount = CatmullRomSpline.DEFAULT_SAMPLE_COUNT)
  {
    return CatmullRomSpline.samplePointsByDistance(
      CatmullRomSpline.fillSplinePoints(p0, p1, p2, p3,
        CatmullRomSpline.chordalGetDeltaT, sampleCount), pointCount);
  }

}