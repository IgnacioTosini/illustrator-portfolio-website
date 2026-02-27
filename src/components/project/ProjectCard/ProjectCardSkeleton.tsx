import './_projectCard.scss'
import './_projectCardSkeleton.scss'

export default function ProjectCardSkeleton() {
    return (
        <div className="projectCard projectCardSkeleton" aria-hidden="true">
            <div className="projectCardImageContainer">
                <div className="projectCardImage skeletonBlock" />
                <div className="projectCardContent">
                    <span className="skeletonText skeletonTextTitle" />
                    <span className="skeletonText skeletonTextSubtitle" />
                </div>
            </div>

            <span className="skeletonText skeletonTextTitle" />
            <span className="skeletonText skeletonTextSubtitle" />
        </div>
    )
}
